import { DOCUMENT, Injectable, OnDestroy, inject } from '@angular/core';

// The clear and the write cannot share a task or they coalesce into one change and nothing is
// announced. 100ms matches the CDK's `LiveAnnouncer`
const ANNOUNCE_DELAY = 100;

// `aria-modal="true"` hides everything outside itself from screen readers, the regions included
const OPEN_DIALOG_SELECTOR = '[aria-modal="true"]';

// Appended to distinguish a message from an identical one before it. A trailing non-breaking space
// is not spoken, so it changes the text without changing what the user hears
const PADDING = ' ';

let uniqueId = 0;

/**
 * Announces toasts from persistent body-level live regions rather than from a role on the toast
 * itself: the outlet is created lazily, and a region entering the DOM together with its content is
 * not reliably announced. Announcing separately also lets the message reach the user from inside an
 * open `aria-modal` dialog, which the visible toast cannot do.
 */
@Injectable({ providedIn: 'root' })
export class ToastAnnouncer implements OnDestroy {
    private _document = inject<Document>(DOCUMENT);

    private _politeRegion: HTMLElement;
    private _assertiveRegion: HTMLElement;

    private _announceTimer: ReturnType<typeof setTimeout>;
    private _lastAnnounced = new WeakMap<HTMLElement, string>();

    constructor() {
        this._politeRegion = this._createRegion('status');
        this._assertiveRegion = this._createRegion('alert');
    }

    /** `message` already includes any type prefix. `error` announces assertively, anything else politely */
    announce(message: string, typeId: string): void {
        if (!message) {
            return;
        }
        // A region holds one message at a time, so a new toast supersedes one that has not landed
        clearTimeout(this._announceTimer);

        const region = this._getRegion(typeId);
        const text = this._distinguishFromLast(message, region);

        this._exposeToTopmostDialog(region);
        region.textContent = '';
        this._announceTimer = setTimeout(() => (region.textContent = text), ANNOUNCE_DELAY);
    }

    /**
     * A screen reader drops an update whose text matches what it has just announced, so clicking
     * the same action twice would be heard once. Padding alternates on and off, which is enough to
     * make each write a new string; comparing against the padded text keeps it self-correcting.
     */
    private _distinguishFromLast(message: string, region: HTMLElement): string {
        const text = this._lastAnnounced.get(region) === message ? message + PADDING : message;

        this._lastAnnounced.set(region, text);

        return text;
    }

    /**
     * An open dialog hides the body-level regions, so the topmost one is given ownership of the
     * region in use: an owned element joins the dialog's accessibility subtree and is exposed again.
     * The region itself stays where it is, so it still announces normally once the dialog closes.
     */
    private _exposeToTopmostDialog(region: HTMLElement): void {
        const dialogs = Array.from(this._document.querySelectorAll(OPEN_DIALOG_SELECTOR));

        // An element may only be owned by one other, so stale references are dropped first
        dialogs.forEach(dialog => this._setOwnedRegion(dialog, null));
        this._setOwnedRegion(dialogs[dialogs.length - 1], region);
    }

    // Only our own ids are added and removed, leaving any the application set alone
    private _setOwnedRegion(dialog: Element | undefined, region: HTMLElement | null): void {
        if (!dialog) {
            return;
        }
        const ids = (dialog.getAttribute('aria-owns') || '')
            .split(/\s+/)
            .filter(id => id && id !== this._politeRegion.id && id !== this._assertiveRegion.id);

        if (region) {
            ids.push(region.id);
        }

        if (ids.length) {
            dialog.setAttribute('aria-owns', ids.join(' '));
        } else {
            dialog.removeAttribute('aria-owns');
        }
    }

    private _getRegion(typeId: string): HTMLElement {
        return typeId === 'error' ? this._assertiveRegion : this._politeRegion;
    }

    private _createRegion(role: string): HTMLElement {
        const region = this._document.createElement('div');

        region.id = `nw-toast-announcer-${uniqueId++}`;
        region.setAttribute('role', role);
        // An alert interrupts; a status waits until previous announcements have finished
        region.setAttribute('aria-live', role === 'alert' ? 'assertive' : 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.classList.add('sr-only');
        this._document.body.appendChild(region);

        return region;
    }

    ngOnDestroy(): void {
        clearTimeout(this._announceTimer);
        this._document.querySelectorAll(OPEN_DIALOG_SELECTOR).forEach(dialog => this._setOwnedRegion(dialog, null));
        this._politeRegion.remove();
        this._assertiveRegion.remove();
    }
}
