import { DOCUMENT, Injectable, OnDestroy, inject } from '@angular/core';

/**
 * The clear and the write cannot share a task or they coalesce into one change and nothing is
 * announced. 100ms matches the CDK's own `LiveAnnouncer`
 */
const ANNOUNCE_DELAY = 100;

/**
 * An `aria-modal="true"` element hides everything outside itself from screen readers, including the
 * body-level regions below
 */
const OPEN_DIALOG_SELECTOR = '[aria-modal="true"]';

/**
 * How long to wait for an open dialog to close before announcing inside it instead. A toast is
 * usually shown just before its dialog closes, so waiting is the common case
 */
const DIALOG_WAIT_TIMEOUT = 500;

const DIALOG_POLL_INTERVAL = 50;

/**
 * Announces toast messages from persistent body-level live regions rather than from a role on the
 * toast itself: the outlet is created lazily, and a region entering the DOM together with its
 * content is not reliably announced. It also lets an announcement be routed around an open
 * `aria-modal` dialog, which the visible toast cannot be
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
            this._writeMessageToRegion(message, this._getRegion(typeId));
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
                this._writeMessageToRegion(message, this._getRegion(typeId));
                return;
            }

            if (waited >= DIALOG_WAIT_TIMEOUT) {
                clearInterval(this._dialogPollTimer);
                this._writeMessageToRegion(message, this._getDialogRegion(dialog, typeId));
            }
        }, DIALOG_POLL_INTERVAL);
    }

    private _writeMessageToRegion(message: string, region: HTMLElement): void {
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
        // An alert interrupts; a status waits until previous announcements have finished
        region.setAttribute('aria-live', role === 'alert' ? 'assertive' : 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.classList.add('sr-only');
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
