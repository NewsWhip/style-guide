import {
    CloseScrollStrategy,
    ConnectionPositionPair,
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayRef,
    RepositionScrollStrategy
} from '@angular/cdk/overlay';
import { _IdGenerator } from '@angular/cdk/a11y';
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
 * a description of its host or a dialog the user opens - is decided by the subclass through `_onCalloutOpened`. Neither
 * subclass can reach the other's behaviour
 */
@Directive()
export abstract class CalloutBaseDirective implements OnInit, OnDestroy {
    protected _elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _overlay = inject(Overlay);
    private _vcRef = inject(ViewContainerRef);
    private _injector = inject(Injector);

    /**
     * The id of the callout element, so that it can be referenced by `aria-describedby`. From the CDK generator
     * rather than a module-level counter, so that ids stay unique across two copies of the library on one page and
     * stable between a server render and its hydration
     */
    protected readonly _calloutId = inject(_IdGenerator).getId('nw-callout-');

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
    /** Number of ms to wait before opening. Defaults per kind of callout - see `_getTriggerDefaults` */
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
        filter(isOpen => isOpen !== undefined)
    );

    /**
     * The strategies the CDK needs, derived rather than rebuilt on demand. Both are memoised, and the CDK ignores
     * an update that hands it the strategy it already has
     */
    private readonly _positionStrategy = computed(() => this._getPositionStrategy(this.placement()));
    private readonly _scrollStrategy = computed(() => this._getScrollStrategy(this._triggers().closeOnScroll));

    /**
     * The events and timings this callout actually opens with: what the consumer bound, falling back to the
     * defaults for its kind. Derived rather than assigned, so that a rebound input still wins
     */
    protected readonly _triggers: Signal<ICalloutTriggers> = computed(() => {
        const defaults = this._getTriggerDefaults();

        return {
            delay: this.delay() ?? defaults.delay,
            openEvents: this.openEvents() ?? defaults.openEvents,
            closeEvents: this.closeEvents() ?? defaults.closeEvents,
            closeOnScroll: this.closeOnScroll() ?? defaults.closeOnScroll,
            pointerEvents: this.pointerEvents() ?? defaults.pointerEvents
        };
    });

    private _overlayRef: OverlayRef | null = null;
    private _destroyed$ = new Subject<void>();
    private _cancelDelayedOpen$ = new Subject<void>();
    /** The `.tooltip` element of the open callout */
    protected _calloutEl: HTMLElement | null = null;
    private _manualToggleEvent$ = new Subject<boolean>();
    /** Emits only where the subclass opted into outside-click dismissal - see `_open` */
    private _outsideClick$ = new Subject<boolean>();
    /** Set while the directive is being torn down, so that closing does not act on a host that is going away */
    protected _isDestroyed: boolean = false;

    /** The content, which each subclass declares as its own input under its own selector */
    protected abstract readonly _content: Signal<string | TemplateRef<any>>;

    /** The events, delay and pointer behaviour this kind of callout opens with */
    protected abstract _getTriggerDefaults(): ICalloutTriggers;

    /**
     * Expose the callout to assistive technology, once its content has rendered. This is the whole of the difference
     * between a tooltip and a popover
     */
    protected abstract _onCalloutOpened(calloutEl: HTMLElement): void;

    /** Any key other than Escape that this kind of callout responds to, while it is open */
    protected _onCalloutKeydown(_event: KeyboardEvent): void {
        // nothing by default
    }

    /** Undo whatever `_onCalloutOpened` did, as the callout closes */
    protected _onCalloutClosing(): void {
        // nothing by default
    }

    /** Whether the callout renders a close button. Only a popover does */
    protected _hasCloseButton(): boolean {
        return false;
    }

    /** Whether a pointer event outside the callout closes it */
    protected _dismissesOnOutsideClick(): boolean {
        return false;
    }

    /** Any further open or close events the subclass contributes, e.g. a tooltip opening on keyboard focus */
    protected _getAdditionalToggleEvents(): Observable<boolean> {
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

    /** Attaches the callout, returning its container - or null where it was already open */
    private _open(): ComponentRef<TooltipContainerComponent> | null {
        /**
         * Create the overlay, and subscribe to what it alone can tell us, the first time the callout is opened
         */
        if (!this._overlayRef) {
            this._createOverlay();
            this._subscribeToCalloutKeydown();

            if (this._dismissesOnOutsideClick()) {
                this._subscribeToOutsidePointerEvents();
            }
        }

        if (this._overlayRef.hasAttached()) {
            return null;
        }

        const portal = new ComponentPortal(TooltipContainerComponent, this._vcRef, this._createInjector());
        const ref = this._overlayRef.attach(portal);
        this.nwShown.emit();

        return ref;
    }

    /**
     * Escape closes any callout, which is required of content that appears on hover or focus
     * ref: https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
     *
     * Every other key is the subclass's to answer, if it answers any
     */
    private _subscribeToCalloutKeydown(): void {
        this._overlayRef
            .keydownEvents()
            .pipe(
                filter(_ => this._overlayRef?.hasAttached()),
                takeUntil(this._destroyed$)
            )
            .subscribe(event => {
                if (event.key === 'Escape') {
                    this.nwClose.emit();
                    this._close();

                    return;
                }

                this._onCalloutKeydown(event);
            });
    }

    /**
     * A pointer event anywhere but the callout and its host closes the callout, for the subclasses that ask for it
     */
    private _subscribeToOutsidePointerEvents(): void {
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

    protected _close(): void {
        if (this._overlayRef?.hasAttached()) {
            this._onCalloutClosing();
            this._overlayRef.detach();
            this._calloutEl = null;
            this.nwHidden.emit();
        }
    }

    private _createOverlay() {
        const positionStrategy = this._positionStrategy();
        const scrollStrategy = this._scrollStrategy();
        const disposeOnNavigation = true;
        const panelClasses: string[] = ['tooltip-overlay', `pointer-events-${this._triggers().pointerEvents}`];
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
            tooltip: this._content(),
            id: this._calloutId,
            containerClass: this.containerClass(),
            withArrow: this.withArrow(),
            withClose: this._hasCloseButton(),
            templateRefContext: this.context()
        };

        return Injector.create({
            parent: this._injector,
            providers: [{ provide: TOOLTIP_CONTEXT_TOKEN, useValue: tooltipData }]
        });
    }

    /**
     * The one subscription that opens and closes the callout, from every source that can ask for either
     */
    private _subscribeToEvents(): void {
        this._getToggleEvents$()
            .pipe(
                debounce(() => (this._hasOverlappingToggleEvents() ? timer(5) : of(0))),
                filter(_ => !this.isDisabled()),
                switchMap(isOpenEvent => this._delayIfOpening(isOpenEvent)),
                takeUntil(this._destroyed$)
            )
            .subscribe(isOpenEvent => (isOpenEvent ? this._openAndExpose() : this._close()));
    }

    /**
     * Every source that can open or close the callout, as a single stream of whether it should now be open.
     * `_outsideClick$` is included unconditionally, as `_open` is what decides whether anything pushes into it
     */
    private _getToggleEvents$(): Observable<boolean> {
        return merge(
            ...this._getOpenEvents$().concat(
                this._getCloseEvents$(),
                this._manualToggleEvent$,
                this._isOpen$,
                this._outsideClick$,
                this._getAdditionalToggleEvents()
            )
        );
    }

    /** The host events that open the callout, ignored while it is already open */
    private _getOpenEvents$(): Observable<boolean>[] {
        return this._triggers().openEvents.map(eventName =>
            fromEvent(this._elRef.nativeElement, eventName).pipe(
                filter(_ => !this._overlayRef?.hasAttached()),
                map(_ => true)
            )
        );
    }

    /** The host events that close the callout. They also cancel an open that is still waiting out its delay */
    private _getCloseEvents$(): Observable<boolean>[] {
        return this._triggers().closeEvents.map(eventName =>
            fromEvent(this._elRef.nativeElement, eventName).pipe(
                tap(_ => this._cancelDelayedOpen$.next()),
                filter(_ => this._overlayRef?.hasAttached()),
                map(_ => false)
            )
        );
    }

    /**
     * Whether the same event both opens and closes the callout - "click" in both lists, say - which fires the
     * merged stream twice within a few ms. The debounce this feeds keeps that from opening and instantly closing
     */
    private _hasOverlappingToggleEvents(): boolean {
        return this._triggers().openEvents.some(e => this._triggers().closeEvents.includes(e));
    }

    /** Hold an open event for `delay`, cancellable by a close event in the meantime. Closing is never delayed */
    private _delayIfOpening(isOpenEvent: boolean): Observable<boolean> {
        if (!isOpenEvent || !this._triggers().delay) {
            return of(isOpenEvent);
        }

        return of(isOpenEvent).pipe(delay(this._triggers().delay), takeUntil(this._cancelDelayedOpen$));
    }

    /**
     * Open the callout and hand it to the subclass to expose, which can only happen once its content has rendered
     */
    private _openAndExpose(): void {
        const ref = this._open();

        /**
         * No ref is returned where the overlay is already attached
         */
        if (!ref) {
            return;
        }

        ref.changeDetectorRef.detectChanges();
        this._calloutEl = this._overlayRef.overlayElement.querySelector('.tooltip');

        if (this._calloutEl) {
            this._onCalloutOpened(this._calloutEl);
        }

        this._subscribeToContainerClose(ref);
    }

    /**
     * Close on the container's own close button. Released with the container it belongs to, so that a callout
     * opened and closed repeatedly does not leave a subscription behind on each destroyed instance
     */
    private _subscribeToContainerClose(ref: ComponentRef<TooltipContainerComponent>): void {
        const closeSub = ref.instance.close.subscribe(_ => {
            this.nwClose.emit();
            this._close();
        });

        ref.onDestroy(() => closeSub.unsubscribe());
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

    /**
     * The size of the arrow the callout has to be offset by, read from the `--tooltip-arrow-size` custom property
     * that `_tooltip.scss` publishes off `$tooltip-arrow-width`, so that overriding that variable moves the arrow
     * and the space reserved for it together.
     *
     * Read from the host rather than measured off the arrow itself, which is a zero-size CSS triangle that does
     * not exist yet: the offsets are baked into the position pairs before the callout is ever attached.
     *
     * Read once per strategy build rather than cached for the directive's life, so that a theme that retunes the
     * property at runtime is picked up the next time the strategy is rebuilt, while a single build still only asks
     * the one time for all of its candidate placements
     */
    private _readArrowSize(): number {
        const declared = getComputedStyle(this._elRef.nativeElement).getPropertyValue('--tooltip-arrow-size');

        /**
         * Falls back where the library stylesheet has not been included, as in a test that renders the directive
         * alone. Kept in step with `$tooltip-arrow-width` in `_variables.scss`, which is what the property carries
         */
        return parseFloat(declared) || 5;
    }

    private _getPositionPair(placement: Placement, arrowSize: number): ConnectionPositionPair {
        /** Enough to clear the arrow, plus 3px so that the callout is not flush with its host */
        const offset = arrowSize + 3;
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
        const arrowSize = this._readArrowSize();
        /**
         * Get positions from preferred placements
         */
        const primaryPositions = placementsList.map(p => this._getPositionPair(p, arrowSize));
        /**
         * If `autoFlip` is enabled, include the inverse position of each `placement` input. Each of this inverse positions
         * will have a lower priority than each of the preferred positions generated from the `placement` input
         */
        const positions = this.autoFlip()
            ? [...primaryPositions, ...placementsList.map(p => this._getPositionPair(placementFlipMap[p], arrowSize))]
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

    /**
     * `_close` rather than `hide`, which only asks the debounced pipeline to close and so would never arrive before
     * the subscription is torn down below. Going straight there also runs `_onCalloutClosing` exactly once, and only
     * where the callout was actually open - `hide` followed by an unconditional `_onCalloutClosing` did neither
     */
    ngOnDestroy() {
        this._isDestroyed = true;
        this._close();
        this._destroyed$.next();
        this._destroyed$.complete();
        this._overlayRef?.dispose();
    }
}
