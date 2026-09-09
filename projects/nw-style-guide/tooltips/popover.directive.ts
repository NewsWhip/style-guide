import { FocusTrap, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { Directive, Signal, TemplateRef, inject, input } from '@angular/core';
import { CalloutBaseDirective } from './callout-base.directive';
import { ICalloutTriggers } from './models/ICalloutTriggers';

/**
 * A callout that can hold interactive content - formatted text, links and buttons - toggled by clicking its host,
 * which should be a button and which the keyboard fires from Enter and Space.
 *
 * It is exposed as a small dialog, named after its trigger and described by its own content, and it announces
 * itself by taking focus. Focus is trapped there until it closes - on Escape, on the close button, or on a click
 * outside - and then returns to where it came from. Content that is only text and only needs describing belongs in
 * a `nwTooltip` instead
 */
@Directive({
    selector: '[nwPopover]',
    exportAs: 'nw-popover'
})
export class PopoverDirective extends CalloutBaseDirective {
    private _focusTrapFactory = inject(FocusTrapFactory);
    private _interactivityChecker = inject(InteractivityChecker);

    readonly nwPopover = input<string | TemplateRef<any>>();
    /** Display a close button or not */
    readonly withClose = input(false);
    readonly closeOnOutsideClick = input(false);

    private _focusTrap: FocusTrap | null = null;
    /** The element focused before focus was moved into the callout */
    private _previouslyFocusedEl: HTMLElement | null = null;

    protected readonly content: Signal<string | TemplateRef<any>> = this.nwPopover;

    protected override hasCloseButton(): boolean {
        return this.withClose();
    }

    protected override dismissesOnOutsideClick(): boolean {
        return this.closeOnOutsideClick();
    }

    protected getTriggerDefaults(): ICalloutTriggers {
        return {
            delay: 0,
            openEvents: ['click'],
            closeEvents: ['click'],
            closeOnScroll: false,
            pointerEvents: 'auto'
        };
    }

    /**
     * Announce the trigger as one that opens a dialog, and as currently closed. Done up front rather than on the
     * first open, so that a screen reader user is told the control does something before they operate it
     */
    override ngOnInit(): void {
        super.ngOnInit();

        const host = this._elRef.nativeElement;

        host.setAttribute('aria-haspopup', 'dialog');
        host.setAttribute('aria-expanded', 'false');
    }

    /**
     * Name the callout after the host, announce it on the host, and move focus into it
     */
    protected onCalloutOpened(calloutEl: HTMLElement): void {
        calloutEl.setAttribute('role', 'dialog');
        calloutEl.setAttribute('aria-labelledby', this._getHostId());
        /**
         * A dialog, unlike a tooltip, does not take its name from its contents, so the content has to be pointed
         * at explicitly or focusing the callout announces its name and nothing else
         */
        calloutEl.setAttribute('aria-describedby', `${this.calloutId}-content`);
        this._elRef.nativeElement.setAttribute('aria-expanded', 'true');

        if (this._focusCalloutIfOpenedFromHost(calloutEl)) {
            this._trapFocusIfThereIsSomethingToTrap(calloutEl);
        }
    }

    /**
     * Release the focus trap, restoring focus unless the user has already moved it, e.g. by clicking outside
     */
    protected override onCalloutClosing(): void {
        /**
         * Restore only focus that is still ours to move. Not where the user has already taken it elsewhere, and not
         * while the directive is being destroyed - the trigger is on its way out of the document, so focusing it
         * would strand focus on a removed element rather than hand it back
         */
        const shouldRestoreFocus =
            !this._isDestroyed &&
            this._previouslyFocusedEl?.isConnected &&
            this._calloutEl?.contains(document.activeElement);

        this._focusTrap?.destroy();
        this._focusTrap = null;
        this._elRef.nativeElement.setAttribute('aria-expanded', 'false');

        if (shouldRestoreFocus) {
            this._previouslyFocusedEl.focus();
        }

        this._previouslyFocusedEl = null;
    }

    /**
     * Tabbing out of an untrapped callout would land at the end of the document, as the overlay is appended to the
     * body. Close and hand focus back to the host instead, so that tabbing carries on from where it left off
     */
    protected override onCalloutKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Tab' || !this._calloutEl?.contains(document.activeElement)) {
            return;
        }

        /**
         * Content can turn interactive after the callout opened - something that loaded in, or an `@if` that
         * flipped - so the decision not to trap is revisited here rather than left as it was found at open time.
         * A trap created now still has its anchors in place before the browser acts on this Tab
         */
        if (this._focusTrap || this._trapFocusIfThereIsSomethingToTrap(this._calloutEl)) {
            return;
        }

        event.preventDefault();
        this.nwClose.emit();
        this._close();
    }

    /**
     * Trap focus, but only where there is something to trap it on: a trap around content with nothing tabbable in
     * it holds focus on its own hidden anchor, which reads as focus disappearing. Returns whether it trapped
     */
    private _trapFocusIfThereIsSomethingToTrap(calloutEl: HTMLElement): boolean {
        const hasTabbableContent = Array.from(calloutEl.querySelectorAll<HTMLElement>('*')).some(el =>
            this._interactivityChecker.isTabbable(el)
        );

        if (hasTabbableContent) {
            this._focusTrap = this._focusTrapFactory.create(calloutEl);
        }

        return hasTabbableContent;
    }

    /**
     * Move focus to the callout, which is the only thing that announces it: a description added while it is open is
     * not read, as nothing re-reads a changed attribute. The callout itself is focused rather than the first thing
     * in it, so that its name is announced before its content, and so that long content can be read at the user's
     * own pace rather than in one unstoppable burst.
     *
     * Only done when focus is on the host, which means the user has just acted on it and following the callout
     * continues what they were doing. An open from the `isOpen` input or from `show()` while focus is elsewhere
     * must not take it - the docs page alone has popovers that are open from the moment it loads
     */
    private _focusCalloutIfOpenedFromHost(calloutEl: HTMLElement): boolean {
        if (!this._elRef.nativeElement.contains(document.activeElement)) {
            return false;
        }

        this._previouslyFocusedEl = document.activeElement as HTMLElement;
        calloutEl.setAttribute('tabindex', '-1');
        calloutEl.focus();

        return true;
    }

    /** An id for the host, so that the dialog can be labelled by it. Only generated if it has none */
    private _getHostId(): string {
        const host = this._elRef.nativeElement;

        if (!host.id) {
            host.id = `${this.calloutId}-trigger`;
        }

        return host.id;
    }
}
