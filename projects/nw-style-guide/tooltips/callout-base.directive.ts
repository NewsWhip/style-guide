import {
    CloseScrollStrategy,
    ConnectionPositionPair,
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayRef,
    RepositionScrollStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ComponentRef,
    Directive,
    ElementRef,
    Injector,
    OnDestroy,
    OnInit,
    Signal,
    TemplateRef,
    ViewContainerRef,
    computed,
    effect,
    inject,
    input,
    output
} from '@angular/core';
import { Placement } from './models/Placement.type';
import { Subject, fromEvent, merge, EMPTY, of, Observable, animationFrameScheduler, timer, interval } from 'rxjs';
import { takeUntil, filter, tap, map, debounce, switchMap, delay } from 'rxjs/operators';
import { TOOLTIP_CONTEXT_TOKEN } from './config/tooltip-context-token';
import { TooltipContainerComponent } from './tooltip-container.component';
import { ITooltipData } from './models/ITooltipData';
import { ICalloutTriggers } from './models/ICalloutTriggers';
import { placementFlipMap } from './config/placement-flip-map';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * The overlay engine behind `nwTooltip` and `nwPopover`: it positions a callout against a host element, opens and
 * closes it on the configured events, and renders the content into a `TooltipContainerComponent`.
 *
 * It has no selector and is abstract, so it cannot be attached to an element. What a callout *means* - whether it is
 * a description of its host or a dialog the user opens - is decided by the subclass through `onCalloutOpened`. Neither
 * subclass can reach the other's behaviour
 */
@Directive()
export abstract class NwCalloutBaseDirective implements OnInit, OnDestroy {
    protected _elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _overlay = inject(Overlay);
    private _vcRef = inject(ViewContainerRef);
    private _injector = inject(Injector);

    private static _idCounter = 0;
    /** The id of the callout element, so that it can be referenced by `aria-describedby` */
    protected readonly calloutId = `nw-callout-${++NwCalloutBaseDirective._idCounter}`;

    /**
     * An object that can be passed when the content is a `TemplateRef`
     * ref: https://angular.io/api/core/ng-template#context
     */
    readonly context = input<any>();
    /** One or more preferred placement options */
    readonly placement = input<Placement | Placement[]>();
    /** Manually control the opening and closing of the callout */
    readonly isOpen = input<boolean>();
    /**
     * When true, the callout will not respond to any open or close events. Nor will it respond to changes to the
     * `isOpen` input
     */
    readonly isDisabled = input(false);
    /** Number of ms to wait before opening. Defaults per kind of callout - see `getTriggerDefaults` */
    readonly delay = input<number>();
    /** Change the placement of the callout to its opposite position when it moves outside the viewport */
    readonly autoFlip = input(true);
    /** A list of events that open the callout */
    readonly openEvents = input<string[]>();
    /** A list of events that close the callout */
    readonly closeEvents = input<string[]>();
    /** A class to apply to the callout container */
    readonly containerClass = input<string>();
    /** Display an arrow or not. The location of the arrow is dependant on the current `placement` */
    readonly withArrow = input(true);
    readonly closeOnScroll = input<boolean>();
    /**
     * WARNING: Use with caution - there are potential performance issues with this
     *
     * Update the position of the callout before the next browser repaint. An example of where this may be required is
     * if the callout is attached (and open) to an element that transitions or animates to a new position
     */
    readonly updatePositionOnAnimationFrame = input(false);
    /**
     * In the case where the callout should not be attached to the host element, a reference to another element can be
     * used
     */
    readonly connectedTo = input<ElementRef<HTMLElement> | Element>();
    /** Determines whether pointer events are enabled on the cdk-overlay-pane element */
    readonly pointerEvents = input<'auto' | 'none'>();
    readonly hostElementZIndex = input<number>();

    readonly nwShown = output<void>();
    readonly nwHidden = output<void>();
    readonly nwClose = output<void>();

    /**
     * `isOpen` as a stream, so that manual control joins the same pipeline as every other open and close event.
     * Undefined is filtered out: an unbound `isOpen` should say nothing rather than assert that it is closed
     */
    private readonly _isOpen$: Observable<boolean> = toObservable(this.isOpen).pipe(
        filter((isOpen): isOpen is boolean => isOpen !== undefined)
    );

    /**
     * The strategies the CDK needs, derived rather than rebuilt on demand. Both are memoised, and the CDK ignores
     * an update that hands it the strategy it already has
     */
    private readonly _positionStrategy = computed(() => this._getPositionStrategy(this.placement()));
    private readonly _scrollStrategy = computed(() => this._getScrollStrategy(this.triggers().closeOnScroll));

    /**
     * The events and timings this callout actually opens with: what the consumer bound, falling back to the
     * defaults for its kind. Derived rather than assigned, so that a rebound input still wins
     */
    protected readonly triggers: Signal<ICalloutTriggers> = computed(() => {
        const defaults = this.getTriggerDefaults();

        return {
            delay: this.delay() ?? defaults.delay,
            openEvents: this.openEvents() ?? defaults.openEvents,
            closeEvents: this.closeEvents() ?? defaults.closeEvents,
            closeOnScroll: this.closeOnScroll() ?? defaults.closeOnScroll,
            pointerEvents: this.pointerEvents() ?? defaults.pointerEvents
        };
    });

    protected _overlayRef: OverlayRef | null = null;
    protected _destroyed$: Subject<void> = new Subject();
    protected _cancelDelayedOpen$: Subject<void> = new Subject();
    /** The `.tooltip` element of the open callout */
    protected _calloutEl: HTMLElement | null = null;
    private _tooltipArrowSize: number = 5;
    private _manualToggleEvent$: Subject<boolean> = new Subject();
    /**
     * A subject that emits when the TooltipContainerComponent is destroyed
     */
    private _tooltipContainerDestroyed$: Subject<void> = new Subject();
    private _outsideClick$: Subject<boolean> = new Subject();

    /** The content, which each subclass declares as its own input under its own selector */
    protected abstract readonly content: Signal<string | TemplateRef<any>>;

    /** The events, delay and pointer behaviour this kind of callout opens with */
    protected abstract getTriggerDefaults(): ICalloutTriggers;

    /**
     * Expose the callout to assistive technology, once its content has rendered. This is the whole of the difference
     * between a tooltip and a popover
     */
    protected abstract onCalloutOpened(calloutEl: HTMLElement): void;

    /** Any key other than Escape that this kind of callout responds to, while it is open */
    protected onCalloutKeydown(_event: KeyboardEvent): void {
        // nothing by default
    }

    /** Undo whatever `onCalloutOpened` did, as the callout closes */
    protected onCalloutClosing(): void {
        // nothing by default
    }

    /** Whether the callout renders a close button. Only a popover does */
    protected hasCloseButton(): boolean {
        return false;
    }

    /** Whether a pointer event outside the callout closes it */
    protected dismissesOnOutsideClick(): boolean {
        return false;
    }

    /** Any further open or close events the subclass contributes, e.g. a tooltip opening on keyboard focus */
    protected getAdditionalToggleEvents(): Observable<boolean> {
        return EMPTY;
    }

    constructor() {
        effect(() => {
            const positionStrategy = this._positionStrategy();

            this._overlayRef?.updatePositionStrategy(positionStrategy);
        });

        effect(() => {
            const scrollStrategy = this._scrollStrategy();

            this._overlayRef?.updateScrollStrategy(scrollStrategy);
        });
    }

    ngOnInit() {
        this._subscribeToEvents();
        this._repositionOnEveryFrame();
    }

    /**
     * Can be called manually from the exported directive to open the callout
     */
    show(): void {
        this._manualToggleEvent$.next(true);
    }

    /**
     * Can be called manually from the exported directive to close the callout
     */
    hide(): void {
        this._manualToggleEvent$.next(false);
    }

    /**
     * Can be called manually from the exported directive to toggle the callout
     */
    toggle(): void {
        const isOpen = this._overlayRef?.hasAttached();
        this._manualToggleEvent$.next(!isOpen);
    }

    private _open(): ComponentRef<TooltipContainerComponent> {
        if (!this._overlayRef) {
            /**
             * Create the overlay the first time the callout is opened
             */
            this._createOverlay();

            this._overlayRef
                .keydownEvents()
                .pipe(
                    filter(_ => this._overlayRef?.hasAttached()),
                    takeUntil(this._destroyed$)
                )
                .subscribe(event => {
                    /**
                     * Dismissing on Escape is required of content that appears on hover or focus
                     * ref: https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
                     */
                    if (event.key === 'Escape') {
                        this.nwClose.emit();
                        this._close();

                        return;
                    }

                    this.onCalloutKeydown(event);
                });

            if (this.dismissesOnOutsideClick()) {
                this._overlayRef
                    .outsidePointerEvents()
                    .pipe(
                        filter(_ => this._overlayRef?.hasAttached()),
                        filter(event => event.target !== this._elRef.nativeElement),
                        map(_ => false),
                        takeUntil(this._destroyed$)
                    )
                    .subscribe(v => this._outsideClick$.next(v));
            }
        }

        if (!this._overlayRef.hasAttached()) {
            const portal = new ComponentPortal(TooltipContainerComponent, this._vcRef, this._createInjector());
            const ref = this._overlayRef.attach(portal);
            this.nwShown.emit();
            return ref;
        }
    }

    protected _close(): void {
        if (this._overlayRef?.hasAttached()) {
            this.onCalloutClosing();
            this._overlayRef.detach();
            this._calloutEl = null;
            this.nwHidden.emit();
        }
    }

    private _createOverlay() {
        const positionStrategy = this._positionStrategy();
        const scrollStrategy = this._scrollStrategy();
        const disposeOnNavigation = true;
        const panelClasses: string[] = ['tooltip-overlay', `pointer-events-${this.triggers().pointerEvents}`];
        this._overlayRef = this._overlay.create({
            positionStrategy,
            scrollStrategy,
            disposeOnNavigation,
            panelClass: panelClasses
        });

        if (this.hostElementZIndex()) {
            this._overlayRef.hostElement.style.zIndex = this.hostElementZIndex().toString();
        }
    }

    /**
     * Create and return a custom injector that provides the callout content as an injectable dependency
     */
    private _createInjector(): Injector {
        const tooltipData: ITooltipData = {
            tooltip: this.content(),
            id: this.calloutId,
            containerClass: this.containerClass(),
            withArrow: this.withArrow(),
            withClose: this.hasCloseButton(),
            templateRefContext: this.context()
        };

        return Injector.create({
            parent: this._injector,
            providers: [{ provide: TOOLTIP_CONTEXT_TOKEN, useValue: tooltipData }]
        });
    }

    private _subscribeToEvents() {
        const openEvents$: Observable<boolean>[] = this.triggers().openEvents.map(eventName => {
            return fromEvent(this._elRef.nativeElement, eventName).pipe(
                filter(_ => !this._overlayRef?.hasAttached()),
                map(_ => true)
            );
        });

        const closeEvents$: Observable<boolean>[] = this.triggers().closeEvents.map(eventName => {
            return fromEvent(this._elRef.nativeElement, eventName).pipe(
                tap(_ => this._cancelDelayedOpen$.next()),
                filter(_ => this._overlayRef?.hasAttached()),
                map(_ => false)
            );
        });

        const outsideClick$: Observable<boolean> = this.dismissesOnOutsideClick()
            ? this._outsideClick$.asObservable()
            : EMPTY;

        /**
         * Merge all open and close events into a single stream that emits a boolean that indicates whether
         * the callout should be opened or closed
         */
        const toggleEvents$ = merge(
            ...openEvents$.concat(
                this._manualToggleEvent$,
                this._isOpen$,
                closeEvents$,
                outsideClick$,
                this.getAdditionalToggleEvents()
            )
        );

        toggleEvents$
            .pipe(
                /**
                 * This debounce prevents instantaneous opening and closing (or vice-versa) in the scenario where `openEvents` contains the
                 * same event as `closeEvents`. For example, if both contain the "click" event, this will be fired twice in the space of a few ms
                 */
                debounce(() => {
                    if (this.triggers().openEvents.some(e => this.triggers().closeEvents.includes(e))) {
                        return timer(5);
                    }
                    return of(0);
                }),
                filter(_ => !this.isDisabled()),
                /**
                 * If this is an open event, use the input delay. Don't apply the delay to the close event
                 */
                switchMap(isOpenEvent => {
                    if (isOpenEvent && this.triggers().delay) {
                        return of(isOpenEvent).pipe(delay(this.triggers().delay), takeUntil(this._cancelDelayedOpen$));
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
                        this._calloutEl = this._overlayRef.overlayElement.querySelector('.tooltip');

                        /**
                         * The content has to have rendered before the subclass can expose it
                         */
                        if (this._calloutEl) {
                            this.onCalloutOpened(this._calloutEl);
                        }

                        ref.instance.close.pipe(takeUntil(this._tooltipContainerDestroyed$)).subscribe(_ => {
                            this.nwClose.emit();
                            this._close();
                        });

                        /**
                         * When the TooltipContainerComponent is destroyed we fire the _tooltipContainerDestroyed$
                         * so that our subscription to TooltipContainerComponent.close is unsubscribed from
                         */
                        ref.onDestroy(() => {
                            this._tooltipContainerDestroyed$.next();
                            this._tooltipContainerDestroyed$.complete();
                        });
                    }
                } else {
                    this._close();
                }
            });
    }

    /**
     * Follow a host that moves under its own steam - one that transitions or animates to a new position - by
     * repositioning before every repaint. Off by default: it costs a reposition per frame while the callout is open
     */
    private _repositionOnEveryFrame(): void {
        if (!this.updatePositionOnAnimationFrame()) {
            return;
        }

        interval(0, animationFrameScheduler)
            .pipe(
                filter(_ => this.updatePositionOnAnimationFrame() && this._overlayRef?.hasAttached()),
                takeUntil(this._destroyed$)
            )
            .subscribe(() => {
                this._overlayRef?.updatePosition();
            });
    }

    private _getPositionPair(placement: Placement): ConnectionPositionPair {
        // Include a 3px offset so that the tooltip is not flush with the element
        const offset = this._tooltipArrowSize + 3;
        const getXOffset = (placement: Placement) => {
            if (!this.withArrow()) {
                return 0;
            }
            if (placement.startsWith('right')) {
                return offset;
            }
            if (placement.startsWith('left')) {
                return -offset;
            }
        };
        const getYOffset = (placement: Placement) => {
            if (!this.withArrow()) {
                return 0;
            }
            if (placement.startsWith('top')) {
                return -offset;
            }
            if (placement.startsWith('bottom')) {
                return offset;
            }
        };
        const getCalloutClass = (placement: Placement): string => `tooltip-${placement}`;
        /**
         * The default position when no placement is specified
         */
        const bottom = new ConnectionPositionPair(
            { originX: 'center', originY: 'bottom' },
            { overlayX: 'center', overlayY: 'top' },
            null,
            getYOffset('bottom'),
            getCalloutClass('bottom')
        );

        switch (placement) {
            case 'top':
                return new ConnectionPositionPair(
                    { originX: 'center', originY: 'top' },
                    { overlayX: 'center', overlayY: 'bottom' },
                    null,
                    getYOffset(placement),
                    getCalloutClass(placement)
                );

            case 'top-start':
                return new ConnectionPositionPair(
                    { originX: 'start', originY: 'top' },
                    { overlayX: 'start', overlayY: 'bottom' },
                    null,
                    getYOffset(placement),
                    getCalloutClass(placement)
                );

            case 'top-end':
                return new ConnectionPositionPair(
                    { originX: 'end', originY: 'top' },
                    { overlayX: 'end', overlayY: 'bottom' },
                    null,
                    getYOffset(placement),
                    getCalloutClass(placement)
                );

            case 'bottom':
                return bottom;

            case 'bottom-start':
                return new ConnectionPositionPair(
                    { originX: 'start', originY: 'bottom' },
                    { overlayX: 'start', overlayY: 'top' },
                    null,
                    getYOffset(placement),
                    getCalloutClass(placement)
                );

            case 'bottom-end':
                return new ConnectionPositionPair(
                    { originX: 'end', originY: 'bottom' },
                    { overlayX: 'end', overlayY: 'top' },
                    null,
                    getYOffset(placement),
                    getCalloutClass(placement)
                );

            case 'right':
                return new ConnectionPositionPair(
                    { originX: 'end', originY: 'center' },
                    { overlayX: 'start', overlayY: 'center' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            case 'right-start':
                return new ConnectionPositionPair(
                    { originX: 'end', originY: 'top' },
                    { overlayX: 'start', overlayY: 'top' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            case 'right-end':
                return new ConnectionPositionPair(
                    { originX: 'end', originY: 'bottom' },
                    { overlayX: 'start', overlayY: 'bottom' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            case 'left':
                return new ConnectionPositionPair(
                    { originX: 'start', originY: 'center' },
                    { overlayX: 'end', overlayY: 'center' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            case 'left-start':
                return new ConnectionPositionPair(
                    { originX: 'start', originY: 'top' },
                    { overlayX: 'end', overlayY: 'top' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            case 'left-end':
                return new ConnectionPositionPair(
                    { originX: 'start', originY: 'bottom' },
                    { overlayX: 'end', overlayY: 'bottom' },
                    getXOffset(placement),
                    null,
                    getCalloutClass(placement)
                );

            default:
                return bottom;
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
        const positions = this.autoFlip()
            ? [...primaryPositions, ...placementsList.map(p => this._getPositionPair(placementFlipMap[p]))]
            : [...primaryPositions];

        return this._overlay
            .position()
            .flexibleConnectedTo(this.connectedTo() || this._elRef)
            .withFlexibleDimensions(false)
            .withPositions(positions)
            .withPush(false);
    }

    private _getScrollStrategy(closeOnScroll: boolean): RepositionScrollStrategy | CloseScrollStrategy {
        if (closeOnScroll) {
            return this._overlay.scrollStrategies.close();
        }
        return this._overlay.scrollStrategies.reposition();
    }

    ngOnDestroy() {
        this.hide();
        this.onCalloutClosing();
        this._destroyed$.next();
        this._destroyed$.complete();
        this._overlayRef?.dispose();
    }
}
