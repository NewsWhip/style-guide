import { DOCUMENT, Injectable, OnDestroy, inject } from '@angular/core';

/**
 * The delay between a live region being cleared and its message being written. A live region only
 * announces when its rendered content changes, so the two writes cannot happen in the same task —
 * they would coalesce into a single change and an identical consecutive message would never
 * register at all. 100ms matches the wait the CDK's own `LiveAnnouncer` uses to accommodate
 * browser and screen reader quirks.
 */
const ANNOUNCE_DELAY = 100;

/**
 * Any element carrying `aria-modal="true"` hides everything outside itself from screen readers,
 * including the body-level live regions below. Toasts are very often shown immediately before the
 * dialog they were triggered from closes, so a dialog being open is not on its own a reason to
 * announce inside it — it is usually about to go away.
 */
const OPEN_DIALOG_SELECTOR = '[aria-modal="true"]';

/**
 * How long to wait for an open dialog to close before giving up and announcing inside it instead.
 * Comfortably longer than a dialog teardown, and short enough to land well within the default
 * `dismissTimeout` of the toast being announced.
 */
const DIALOG_WAIT_TIMEOUT = 500;

const DIALOG_POLL_INTERVAL = 50;

/**
 * Announces toast messages to screen readers.
 *
 * The announcement is deliberately decoupled from the visible toast element rather than being
 * driven by a `role="status"`/`role="alert"` attribute on the toast itself. Two reasons:
 *
 * 1. The toast outlet is created lazily, on the first toast shown. A live region and its content
 *    entering the DOM in the same change detection pass is not reliably announced — screen readers
 *    report mutations *inside* a region that is already present. The regions here are created up
 *    front and left empty for exactly that reason.
 * 2. It allows the announcement to be routed around an open `aria-modal` dialog, which the visible
 *    toast cannot be: the toast has to stay at its own outlet to keep its positioning and to
 *    survive the dialog closing.
 */
@Injectable({ providedIn: 'root' })
export class ToastAnnouncer implements OnDestroy {
    private _document = inject<Document>(DOCUMENT);

    private _politeRegion: HTMLElement;
    private _assertiveRegion: HTMLElement;
    /**
     * A region injected into a dialog that stayed open, e.g. an error toast shown by a modal that
     * keeps the user in place to correct something.
     */
    private _dialogRegion: HTMLElement;

    private _announceTimer: ReturnType<typeof setTimeout>;
    private _dialogPollTimer: ReturnType<typeof setInterval>;

    constructor() {
        this._politeRegion = this._createRegion('status');
        this._assertiveRegion = this._createRegion('alert');
    }

    /**
     * @param message The text to announce, already including any type prefix
     * @param typeId The toast's `typeId`. `error` announces assertively, anything else politely
     */
    announce(message: string, typeId: string): void {
        if (!message) {
            return;
        }
        /**
         * Only one message can occupy a region at a time, so a new toast supersedes an
         * announcement that has not landed yet. This matches the CDK `LiveAnnouncer`'s behaviour.
         */
        this._cancelPending();

        if (!this._getOpenDialog()) {
            this._write(this._getRegion(typeId), message);
            return;
        }
        this._announceAfterDialogCloses(message, typeId);
    }

    private _announceAfterDialogCloses(message: string, typeId: string): void {
        let waited = 0;

        this._dialogPollTimer = setInterval(() => {
            waited += DIALOG_POLL_INTERVAL;
            const dialog = this._getOpenDialog();

            if (!dialog) {
                clearInterval(this._dialogPollTimer);
                this._write(this._getRegion(typeId), message);
                return;
            }

            if (waited >= DIALOG_WAIT_TIMEOUT) {
                clearInterval(this._dialogPollTimer);
                this._write(this._getDialogRegion(dialog, typeId), message);
            }
        }, DIALOG_POLL_INTERVAL);
    }

    private _write(region: HTMLElement, message: string): void {
        region.textContent = '';
        this._announceTimer = setTimeout(() => (region.textContent = message), ANNOUNCE_DELAY);
    }

    private _getOpenDialog(): Element {
        const dialogs = this._document.querySelectorAll(OPEN_DIALOG_SELECTOR);

        // Overlays stack in DOM order, so the last one is the topmost
        return dialogs[dialogs.length - 1];
    }

    /**
     * The region is recreated rather than reused so that its role is correct from the moment it is
     * attached — screen readers do not reliably pick up a role changing on an existing element.
     * `_write`'s delay leaves the region in the DOM before its content arrives.
     */
    private _getDialogRegion(dialog: Element, typeId: string): HTMLElement {
        this._dialogRegion?.remove();
        this._dialogRegion = this._createRegion(this._getRole(typeId), dialog);

        return this._dialogRegion;
    }

    private _getRegion(typeId: string): HTMLElement {
        return typeId === 'error' ? this._assertiveRegion : this._politeRegion;
    }

    private _getRole(typeId: string): string {
        return typeId === 'error' ? 'alert' : 'status';
    }

    private _createRegion(role: string, host: Element = this._document.body): HTMLElement {
        const region = this._document.createElement('div');

        region.setAttribute('role', role);
        /**
         * Styled inline rather than with the `sr-only` utility class: these regions are created
         * imperatively and must stay hidden even if a consumer has not pulled in the stylesheet.
         */
        region.style.cssText =
            'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;';
        host.appendChild(region);

        return region;
    }

    private _cancelPending(): void {
        clearTimeout(this._announceTimer);
        clearInterval(this._dialogPollTimer);
    }

    ngOnDestroy(): void {
        this._cancelPending();
        this._politeRegion.remove();
        this._assertiveRegion.remove();
        this._dialogRegion?.remove();
    }
}
