import { DOCUMENT, Injectable, OnDestroy, inject } from '@angular/core';
/**
 * Announces toasts from persistent body-level live regions rather than from a role on the toast.
 * The toast enters the DOM with its content, too late to be announced reliably, and an open
 * `aria-modal` dialog hides it.
 */
@Injectable({ providedIn: 'root' })
export class ToastAnnouncer implements OnDestroy {
    private _document = inject(DOCUMENT);

    private _politeRegion: HTMLElement;
    private _assertiveRegion: HTMLElement;
    private _dialogRegion: HTMLElement;
    private _announceTimer: ReturnType<typeof setTimeout>;
    private _dialogWaitTimer: ReturnType<typeof setTimeout>;
    private _lastAnnounced = '';

    announce(message: string, typeId: string): void {
        if (!message) {
            return;
        }
        this._cancelPending();

        if (!this._getOpenDialog()) {
            this._writeMessageToRegion(message, this._getRegion(typeId));
            return;
        }
        this._announceAfterDialogCloses(message, typeId);
    }

    /**
     * A toast is usually shown just before its dialog closes, so the announcement waits long enough
     * for that to happen and then looks again. A dialog still open by then is one the user is being
     * kept in — an error to correct — and is announced from inside.
     */
    private _announceAfterDialogCloses(message: string, typeId: string): void {
        const DIALOG_WAIT_TIMEOUT = 500;

        this._dialogWaitTimer = setTimeout(() => {
            const dialog = this._getOpenDialog();
            const region = dialog ? this._getDialogRegion(dialog) : this._getRegion(typeId);

            this._writeMessageToRegion(message, region);
        }, DIALOG_WAIT_TIMEOUT);
    }

    private _writeMessageToRegion(message: string, region: HTMLElement): void {
        // The text cannot land in the same task the region does, or the two arrive as one change and
        // nothing is announced. 100ms matches the CDK's `LiveAnnouncer`
        const ANNOUNCE_DELAY = 100;
        const text = this._distinguishFromLast(message);

        this._announceTimer = setTimeout(() => (region.textContent = text), ANNOUNCE_DELAY);
    }

    /**
     * A screen reader drops an update whose text matches what it has just announced, so clicking
     * the same action twice would be heard once. Padding alternates on and off, which is enough to
     * make each write a new string; comparing against the padded text keeps it self-correcting.
     */
    private _distinguishFromLast(message: string): string {
        // A non-breaking space is not spoken, and unlike a plain space it is not normalised away —
        // which would collapse the padded and unpadded messages back into the same string
        const PADDING = ' ';
        this._lastAnnounced = this._lastAnnounced === message ? message + PADDING : message;

        return this._lastAnnounced;
    }

    private _getOpenDialog(): Element | undefined {
        const dialogs = this._document.querySelectorAll('[aria-modal="true"]');

        // Overlays stack in DOM order, so the last one is the topmost
        return dialogs[dialogs.length - 1];
    }

    /**
     * Always an `alert`, even for a success: a polite region inside a dialog is not reliably
     * announced, and interrupting beats staying silent. Recreated so it lands in the current dialog.
     */
    private _getDialogRegion(dialog: Element): HTMLElement {
        this._dialogRegion?.remove();
        this._dialogRegion = this._createRegion('alert', dialog);

        return this._dialogRegion;
    }

    /**
     * Built on first use and kept, so an app that only shows one type never grows the other region.
     * It is still attached before the message is written, which is what the announce delay is for.
     */
    private _getRegion(typeId: string): HTMLElement {
        if (typeId === 'error') {
            return (this._assertiveRegion ??= this._createRegion('alert'));
        }

        return (this._politeRegion ??= this._createRegion('status'));
    }

    private _createRegion(role: string, host: Element = this._document.body): HTMLElement {
        const region = this._document.createElement('div');

        region.setAttribute('role', role);
        region.setAttribute('aria-live', role === 'alert' ? 'assertive' : 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.classList.add('sr-only');
        host.appendChild(region);

        return region;
    }

    private _cancelPending(): void {
        clearTimeout(this._announceTimer);
        clearTimeout(this._dialogWaitTimer);
    }

    ngOnDestroy(): void {
        this._cancelPending();
        this._politeRegion?.remove();
        this._assertiveRegion?.remove();
        this._dialogRegion?.remove();
    }
}
