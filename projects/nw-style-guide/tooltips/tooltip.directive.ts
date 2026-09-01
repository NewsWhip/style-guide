import { AriaDescriber, FocusMonitor, addAriaReferencedId, removeAriaReferencedId } from '@angular/cdk/a11y';
import { Directive, OnDestroy, Signal, TemplateRef, computed, effect, inject, input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CalloutBaseDirective } from './callout-base.directive';
import { ICalloutTriggers } from './models/ICalloutTriggers';

/**
 * A description of the element it is attached to: a short piece of supplementary text, opened by hovering the host
 * or focusing it from the keyboard.
 *
 * The content reaches assistive technology through the host's `aria-describedby` whether the tooltip is open or not,
 * which matters because a screen reader user cannot hover to open it. A tooltip never takes focus, so anything in it
 * that could be operated would be unreachable - a callout holding a link or a button is a `nwPopover`
 */
@Directive({
    selector: '[nwTooltip]',
    exportAs: 'nw-tooltip'
})
export class TooltipDirective extends CalloutBaseDirective implements OnDestroy {
    private _ariaDescriber = inject(AriaDescriber);
    private _focusMonitor = inject(FocusMonitor);

    readonly tooltip = input<string | TemplateRef<any>>(undefined, { alias: 'nwTooltip' });
    /**
     * Describe the host element with the content, so that screen reader users get it without opening the tooltip.
     * When not set, the description is skipped where the host's accessible name - its `aria-label`, or failing
     * that its visible text - is already the same text, so that it is not announced twice. Set it explicitly to
     * force the description on or off. Note that a description identical to the host's `aria-label` is dropped
     * by the CDK `AriaDescriber` itself, so `true` cannot force that case
     */
    readonly withAriaDescription = input<boolean | undefined>(undefined);
    /**
     * Open when the host is focused from the keyboard, the keyboard equivalent of `mouseenter`. Focus from a pointer
     * is ignored, as clicking an element focuses it and the tooltip would fight the `click` close event, as is
     * programmatic focus, so that restoring focus after closing a modal does not open a tooltip.
     *
     * Note that only an element that can hold focus can be focused: a tooltip on a `span` or `svg` element stays
     * unreachable by keyboard whatever this is set to
     */
    readonly showOnFocus = input<boolean>();
    /**
     * The screen width below which the tooltip opens on tap rather than on hover, as touch devices have no hover.
     * It stays a tooltip either way - only its events change. Set to 0 to always use the hover events
     */
    readonly breakpoint = input(767);

    /** The text currently registered with the `AriaDescriber`, if any */
    private _describedText: string | null = null;

    protected readonly content: Signal<string | TemplateRef<any>> = this.tooltip;

    /**
     * Whether focus opens this tooltip: derived, because a manually controlled tooltip - one with no open events -
     * is opened by its host component alone
     */
    private readonly _opensOnFocus = computed(
        () => this.showOnFocus() ?? this.triggers().openEvents.includes('mouseenter')
    );

    /** The content as plain text, or null when there is nothing describable to register */
    private readonly _describableText = computed(() => {
        const content = this.tooltip();

        if (this.withAriaDescription() === false || typeof content !== 'string') {
            return null;
        }

        const text = this._toPlainText(content) || null;

        /**
         * A description that repeats the host's accessible name verbatim would be announced twice, so it is
         * skipped unless withAriaDescription demands it
         */
        if (this.withAriaDescription() === undefined && text && this._normalize(text) === this._hostAccessibleName()) {
            return null;
        }

        return text;
    });

    constructor() {
        super();
        effect(() => this._registerDescription(this._describableText()));
    }

    override ngOnDestroy(): void {
        super.ngOnDestroy();
        this._focusMonitor.stopMonitoring(this._elRef);

        if (this._describedText) {
            this._ariaDescriber.removeDescription(this._elRef.nativeElement, this._describedText);
            this._describedText = null;
        }
    }

    protected getTriggerDefaults(): ICalloutTriggers {
        /**
         * There are no hover events on touch, so a tooltip on a small screen opens on tap instead
         */
        if (window.innerWidth < this.breakpoint()) {
            return {
                delay: 0,
                openEvents: ['click'],
                closeEvents: ['click'],
                closeOnScroll: false,
                pointerEvents: 'auto'
            };
        }

        return {
            delay: 500,
            openEvents: ['mouseenter'],
            closeEvents: ['click', 'mouseleave'],
            closeOnScroll: true,
            pointerEvents: 'none'
        };
    }

    /**
     * A tooltip has no outside-click behaviour of its own, but a tap-opened one on touch has no hover to end it,
     * so tapping elsewhere has to dismiss it
     */
    protected override dismissesOnOutsideClick(): boolean {
        return window.innerWidth < this.breakpoint();
    }

    protected onCalloutOpened(calloutEl: HTMLElement): void {
        calloutEl.setAttribute('role', 'tooltip');
        this._setDescribedByCallout(true);
    }

    protected override onCalloutClosing(): void {
        this._setDescribedByCallout(false);
    }

    protected override getAdditionalToggleEvents(): Observable<boolean> {
        return this._opensOnFocus() ? this._getFocusEvents$() : super.getAdditionalToggleEvents();
    }

    /**
     * Emits true when the host is focused from the keyboard, and false when focus leaves it again
     */
    private _getFocusEvents$(): Observable<boolean> {
        /** Only close on blur what focus opened, so that a hover- or `isOpen`-opened tooltip survives blur */
        let isOpenedByFocus: boolean = false;

        return this._focusMonitor.monitor(this._elRef).pipe(
            filter(origin => origin === 'keyboard' || (origin === null && isOpenedByFocus)),
            tap(origin => (isOpenedByFocus = origin === 'keyboard')),
            map(origin => origin === 'keyboard')
        );
    }

    /** Point `aria-describedby` at the open callout. Only needed for a `TemplateRef`, which cannot be described */
    private _setDescribedByCallout(isOpen: boolean): void {
        if (this.withAriaDescription() === false || this._describedText) {
            return;
        }

        const host = this._elRef.nativeElement;

        if (isOpen) {
            addAriaReferencedId(host, 'aria-describedby', this.calloutId);
        } else {
            removeAriaReferencedId(host, 'aria-describedby', this.calloutId);
        }
    }

    /** Register text with the `AriaDescriber`, which adds it to the accessibility tree as a hidden node */
    private _registerDescription(text: string | null): void {
        if (text === this._describedText) {
            return;
        }

        if (this._describedText) {
            this._ariaDescriber.removeDescription(this._elRef.nativeElement, this._describedText);
        }

        if (text) {
            this._ariaDescriber.describe(this._elRef.nativeElement, text);
        }

        this._describedText = text;
    }

    /**
     * An approximation of the host's accessible name: its `aria-label`, or failing that its visible text. Read
     * when the content changes, which covers hosts whose label and tooltip are bound to the same value; a label
     * that changes independently of the content is not re-read
     */
    private _hostAccessibleName(): string | null {
        const host = this._elRef.nativeElement;

        return this._normalize(host.getAttribute('aria-label') || host.textContent || '') || null;
    }

    private _normalize(text: string): string {
        return text.replace(/\s+/g, ' ').trim();
    }

    /**
     * String content is rendered as HTML, so parse out its text. `DOMParser` in preference to an element's
     * `innerHTML`, as it creates an inert document that loads no resources
     */
    private _toPlainText(content: string): string {
        const text = content.includes('<')
            ? new DOMParser().parseFromString(content, 'text/html').body.textContent
            : content;

        return text.trim();
    }
}
