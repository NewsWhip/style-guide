import { CdkScrollable, CloseScrollStrategy, ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayRef, RepositionScrollStrategy } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, Directive, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewContainerRef } from "@angular/core";
import { Placement } from "./models/Placement.type";
import { Subject, fromEvent, merge, EMPTY, of, Observable, animationFrameScheduler, scheduled } from 'rxjs';
import { takeUntil, filter, tap, map, debounceTime, switchMap, delay, repeat } from 'rxjs/operators';
import { TOOLTIP_CONTEXT_TOKEN } from "./config/tooltip-context-token";
import { TooltipContainerComponent } from "./tooltip-container.component";
import { ITooltipData } from "./models/ITooltipData";
import { placementFlipMap } from "./config/placement-flip-map";

/**
 * TODO
 * - explain what element to add styles to to manually adjust position of tooltip
 * - explain how we always append to body
 * - explain different selectors
 * - is scrollContainers actually necessary or does it pick up cdkScrollable ancenstors automatically?
 */
@Directive({
    selector: '[nwTooltip],[nwPopover]',
    exportAs: 'nw-tooltip,nw-popover'
})
export class TooltipDirective implements OnInit, OnChanges {

    /**
     * This directive can be invoked by using the `nwTooltip` or `nwPopover` attributes. The only differences between using these
     * attributes are the default value are certain properties, e.g. `delay` and open and close events
     */
    @Input('nwTooltip') tooltip: string | TemplateRef<any>;
    @Input('nwPopover') popover: string | TemplateRef<any>;
    /**
     * An object that can be passed when the `tooltip` input is a `TemplateRef`
     * ref: https://angular.io/api/core/ng-template#context
     */
    @Input() context: any;
    /**
     * One or more preferred placement options
     */
    @Input() placement: Placement | Placement[];
    /**
     * Manually control the opening and closing of the tooltip
     */
    @Input() isOpen: boolean;
    /**
     * When true, the tooltip will not not respond to any open or close events. Nor will it
     * respond to changes to the `isOpen` input
     */
    @Input() isDisabled: boolean = false;
    /**
     * number of ms to wait before opening
     */
    @Input() delay: number;
    /**
     * Change the placement of the tooltip to its opposite position when it moves outside the viewport
     * TODO: maybe rename to just `flip`
     */
    @Input() autoFlip: boolean = true;
    /**
     * A list of events that open the tooltip
     */
    @Input() openEvents: string[];
    /**
     * A list of events that close the tooltip
     */
    @Input() closeEvents: string[];
    /**
     * Sets the list of scrollable containers that host the origin element so that on reposition we
     * can evaluate if it or the overlay has been clipped or outside view. Every scrollContainer must be
     * an ancestor element of the origin element
     */
    @Input() scrollContainers: CdkScrollable[] = [];
    /**
     * A class to apply to the tooltip container
     */
    @Input() containerClass: string;
    /**
     * Display an arrow or not. The location of the arrow is dependant on the current `placement`
     */
    @Input() withArrow: boolean = true;
    @Input() closeOnScroll: boolean;
    @Input() closeOnOutsideClick: boolean = false;
    /**
     * WARNING: Use with caution - there are potential performance issues with this
     *
     * Update the position of the tooltip before the next browser repaint. An example of where this may be required is if
     * the tooltip is attached (and open) to an element that transitions or animates to a new position
     */
    @Input() updatePositionOnAnimationFrame: boolean = false;
    /**
     * In the case where the tooltip should not be attached to the host element, a reference to another element can be used
     */
    @Input() connectedTo: ElementRef<HTMLElement>;
    /**
     * TODO: docs
     */
    @Input() pointerEvents: 'auto' | 'none';

    @Output() nwShown: EventEmitter<null> = new EventEmitter();
    @Output() nwHidden: EventEmitter<null> = new EventEmitter();

    private _overlayRef: OverlayRef;
    private _destroyed$: Subject<null> = new Subject();
    private _tooltipArrowSize: number = 5;
    private _manualToggleEvent$: Subject<boolean> = new Subject();
    private _cancelDelayedOpen$: Subject<null> = new Subject();

    constructor(
        private _elRef: ElementRef<HTMLElement>,
        private _overlay: Overlay,
        private _vcRef: ViewContainerRef,
        private _injector: Injector) {}

    ngOnInit() {
        this._setInputDefaults();
        this._createOverlay();
        this._subscribeToEvents();

        if (this.isOpen) {
            this._manualToggleEvent$.next(this.isOpen);
        }

        scheduled(of(0), animationFrameScheduler)
            .pipe(
                filter(_ => this.updatePositionOnAnimationFrame && this._overlayRef.hasAttached()),
                repeat(),
                takeUntil(this._destroyed$)
            )
            .subscribe(() => {
                this._overlayRef.updatePosition();
            });
    }

    ngOnChanges(c: SimpleChanges): void {
        const shouldUpdatePositionStrategy = ['placement', 'withArrow', 'autoFlip', 'scrollContainers']
            .some(inputProp => c[inputProp]?.previousValue !== c[inputProp]?.currentValue && !c[inputProp]?.firstChange);
        const isOpenChange: boolean = c.isOpen?.previousValue !== c.isOpen?.currentValue && !c.isOpen.firstChange;
        const shouldUpdateScrollStrategy: boolean = c.closeOnScroll?.previousValue !== c.closeOnScroll?.currentValue && !c.closeOnScroll.firstChange;

        if (shouldUpdatePositionStrategy) {
            this._updatePositionStrategy(this.placement);
        }

        if (shouldUpdateScrollStrategy) {
            this._updateScrollStrategy(this.closeOnScroll);
        }

        if (isOpenChange) {
            this._manualToggleEvent$.next(this.isOpen);
        }
    }

    /**
     * A public method that can be called manually from the exported directive to open the tooltip
     */
    show(): void {
        this._manualToggleEvent$.next(true);
    }

    /**
     * A public method that can be called manually from the exported directive to close the tooltip
     */
    hide(): void {
        this._manualToggleEvent$.next(false);
    }

    /**
     * A public method that can be called manually from the exported directive to close the tooltip
     */
    toggle(): void {
        const isOpen = this._overlayRef.hasAttached();
        this._manualToggleEvent$.next(!isOpen);
    }

    /**
     * Based on the selector used, choose different default if inputs are not defined
     */
    private _setInputDefaults(): void {
        const getDefaultValue = <T>(currVal: T, defaultVal: T): T => {
            return currVal ?? defaultVal;
        };

        /**
         * Check for undefined and null, not empty strings. This prevents errors when an empty
         * string is passed in the popover or tooltip input
         */
        if (this.popover !== undefined && this.popover !== null) {
            this.delay = getDefaultValue(this.delay, 0);
            this.openEvents = getDefaultValue(this.openEvents, ["click"]);
            this.closeEvents = getDefaultValue(this.closeEvents, ["click"]);
            this.closeOnScroll = getDefaultValue(this.closeOnScroll, false);
            this.pointerEvents = getDefaultValue(this.pointerEvents, 'auto');
        } else {
            this.delay = getDefaultValue(this.delay, 500);
            this.openEvents = getDefaultValue(this.openEvents, ["mouseenter"]);
            this.closeEvents = getDefaultValue(this.closeEvents, ["click", "mouseleave"]);
            this.closeOnScroll = getDefaultValue(this.closeOnScroll, true);
            this.pointerEvents = getDefaultValue(this.pointerEvents, 'none');
        }
    }

    private _getTooltipContent(): string | TemplateRef<any> {
        return this.tooltip || this.popover;
    }

    private _open(): ComponentRef<TooltipContainerComponent> {
        if (!this._overlayRef.hasAttached()) {
            const portal = new ComponentPortal(
                TooltipContainerComponent,
                this._vcRef,
                this._createInjector()
            );
            const ref = this._overlayRef.attach(portal);
            this.nwShown.emit();
            return ref;
        }
    }

    private _close(): void {
        if (this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this.nwHidden.emit();
        }
    }

    private _createOverlay() {
        const positionStrategy = this._getPositionStrategy(this.placement);
        const scrollStrategy = this._getScrollStrategy(this.closeOnScroll);
        const disposeOnNavigation = true;
        const panelClasses: string[] = ["tooltip-overlay", `pointer-events-${this.pointerEvents}`];
        this._overlayRef = this._overlay.create({ positionStrategy, scrollStrategy, disposeOnNavigation, panelClass: panelClasses });
    }

    /**
     * Create and return a custom injector that provides the tooltip text as an injectable dependency
     */
    private _createInjector(): Injector {
        const tooltipData: ITooltipData = {
            tooltip: this._getTooltipContent(),
            containerClass: this.containerClass,
            withArrow: this.withArrow,
            templateRefContext: this.context
        };

        return Injector.create({
            parent: this._injector,
            providers: [
                { provide: TOOLTIP_CONTEXT_TOKEN, useValue: tooltipData }
            ]
        });
    }

    private _subscribeToEvents() {
        const openEvents$: Observable<boolean>[] = this.openEvents.map(eventName => {
            return fromEvent(this._elRef.nativeElement, eventName).pipe(
                filter(_ => !this._overlayRef.hasAttached()),
                map(_ => true)
            );
        });

        const closeEvents$: Observable<boolean>[] = this.closeEvents.map(eventName => {
            return fromEvent(this._elRef.nativeElement, eventName).pipe(
                tap(_ => this._cancelDelayedOpen$.next()),
                filter(_ => this._overlayRef.hasAttached()),
                map(_ => false)
            );
        });

        const outsideClick$: Observable<boolean> = this.closeOnOutsideClick ?
            this._overlayRef.outsidePointerEvents()
                .pipe(
                    filter(_ => this._overlayRef.hasAttached()),
                    // The element that this tooltip is attached to should not be included as an outside click
                    filter(event => event.target !== this._elRef.nativeElement),
                    map(_ => false)
                ) : EMPTY;

        /**
         * Merge all open and close events into a single stream that emits a boolean that indicates whether
         * the tooltip should be opened or closed
         */
        const toggleEvents$ = merge(...openEvents$.concat(this._manualToggleEvent$, closeEvents$, outsideClick$));

        toggleEvents$
            .pipe(
                /**
                 * This debounce prevents instantaneous opening and closing (or vice-versa) in the scenario where `openEvents` contains the
                 * same event as `closeEvents`. For example, if both contain the "click" event, this will be fired twice in the space of a few ms
                 */
                debounceTime(0),
                filter(_ => !this.isDisabled),
                /**
                 * If this is an open event, use the input delay. Don't apply the delay to the close event
                 */
                switchMap(isOpenEvent => {
                    if (isOpenEvent && this.delay) {
                        return of(isOpenEvent).pipe(
                            delay(this.delay),
                            takeUntil(this._cancelDelayedOpen$)
                        );
                    }
                    return of(isOpenEvent);
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe(isOpenEvent => {
                if (isOpenEvent) {
                    const ref = this._open();
    
                    /**
                     * No ref will be returned if the overlay is already attached
                     */
                    if (ref) {
                        ref.changeDetectorRef.detectChanges();
                    }
                } else {
                    this._close();
                }
            });
    }

    private _getPositionPair(placement: Placement): ConnectionPositionPair {
        // Include a 3px offset so that the tooltip is not flush with the element
        const offset = this._tooltipArrowSize + 3;
        const getXOffset = (placement: Placement) => {
            if (!this.withArrow) {
                return 0
            }
            if (placement.startsWith('right')) {
                return offset;  
            }
            if (placement.startsWith('left')) {
                return -offset;  
            }
        };
        const getYOffset = (placement: Placement) => {
            if (!this.withArrow) {
                return 0
            }
            if (placement.startsWith('top')) {
                return -offset;  
            }
            if (placement.startsWith('bottom')) {
                return offset;  
            }
        };
        const getPanelClass = (placement: Placement): string => `tooltip-${placement}`;
        /**
         * The default position when no placement is specified
         */
        const bottom = new ConnectionPositionPair(
            { originX: "center", originY: "bottom" },
            { overlayX: "center", overlayY: "top" },
            null,
            getYOffset('bottom'),
            getPanelClass('bottom')
        );

        switch (placement) {
            case 'top':
                return new ConnectionPositionPair(
                    { originX: "center", originY: "top" },
                    { overlayX: "center", overlayY: "bottom" },
                    null,
                    getYOffset(placement),
                    getPanelClass(placement)
                );

            case 'top-start':
                return new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    null,
                    getYOffset(placement),
                    getPanelClass(placement)
                );

            case 'top-end':
                return new ConnectionPositionPair(
                    { originX: "end", originY: "top" },
                    { overlayX: "end", overlayY: "bottom" },
                    null,
                    getYOffset(placement),
                    getPanelClass(placement)
                );

            case 'bottom':
                return bottom;

            case 'bottom-start':
                return new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    null,
                    getYOffset(placement),
                    getPanelClass(placement)
                );

            case 'bottom-end':
                return new ConnectionPositionPair(
                    { originX: "end", originY: "bottom" },
                    { overlayX: "end", overlayY: "top" },
                    null,
                    getYOffset(placement),
                    getPanelClass(placement)
                );

            case 'right':
                return new ConnectionPositionPair(
                    { originX: "end", originY: "center" },
                    { overlayX: "start", overlayY: "center" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );

            case 'right-start':
                return new ConnectionPositionPair(
                    { originX: "end", originY: "top" },
                    { overlayX: "start", overlayY: "top" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );

            case 'right-end':
                return new ConnectionPositionPair(
                    { originX: "end", originY: "bottom" },
                    { overlayX: "start", overlayY: "bottom" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );

            case 'left':
                return new ConnectionPositionPair(
                    { originX: "start", originY: "center" },
                    { overlayX: "end", overlayY: "center" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );

            case 'left-start':
                return new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "end", overlayY: "top" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );

            case 'left-end':
                return new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "end", overlayY: "bottom" },
                    getXOffset(placement),
                    null,
                    getPanelClass(placement)
                );
        
            default:
                return bottom
        }
    }

    private _getPositionStrategy(placement: Placement | Placement[]): FlexibleConnectedPositionStrategy {
        /**
         * Format `placement` into a consistent data type of `Placement[]`
         */
        const placementsList: Placement[] = [placement].flat();
        /**
         * Get positions from preferred placements
         */
        const primaryPositions = placementsList.map(p => this._getPositionPair(p));
        /**
         * If `autoFlip` is enabled, include the inverse position of each `placement` input. Each of this inverse positions
         * will have a lower priority than each of the preferred positions generated from the `placement` input
         */
        const positions = this.autoFlip ?
            [...primaryPositions, ...placementsList.map(p => this._getPositionPair(placementFlipMap[p]))] :
            [...primaryPositions];

        return this._overlay
            .position()
            .flexibleConnectedTo(this.connectedTo || this._elRef)
            .withPositions(positions)
            .withScrollableContainers(this.scrollContainers)
            .withPush(false);
    }

    private _updatePositionStrategy(placement: Placement | Placement[]): void {
        const positionStrategy = this._getPositionStrategy(placement);
        this._overlayRef.updatePositionStrategy(positionStrategy);
    }

    private _getScrollStrategy(closeOnScroll: boolean): RepositionScrollStrategy | CloseScrollStrategy {
        if (closeOnScroll) {
            return this._overlay.scrollStrategies.close();
        }
        return this._overlay.scrollStrategies.reposition();
    }

    private _updateScrollStrategy(closeOnScroll: boolean): void {
        const scrollStrategy = this._getScrollStrategy(closeOnScroll);
        this._overlayRef.updateScrollStrategy(scrollStrategy);
    }

    ngOnDestroy() {
        this.hide();
        this._destroyed$.next();
        this._destroyed$.complete();
        this._overlayRef.dispose();
    }
}