import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DOCUMENT,
    ElementRef,
    QueryList,
    TemplateRef,
    ViewChildren,
    inject
} from '@angular/core';
import { IToast } from './IToast';
import { Toast } from './Toast';
import { ToastAnnouncer } from './toast-announcer';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgClass, NgTemplateOutlet } from '@angular/common';

/**
 * Prefixes the message so that the toast's type is conveyed in text, for users who cannot see the
 * icon or the background colour that otherwise distinguish a success from an error.
 */
const TYPE_LABELS: Record<string, string> = {
    success: 'Success:',
    error: 'Error:'
};

@Component({
    selector: 'nw-toasts',
    template: `
        <div class="toasts-container">
            @for (toast of toasts; track toast) {
                <div
                    #toastEl
                    class="toast"
                    animate.enter="toast-animate-in"
                    animate.leave="toast-animate-out"
                    [ngClass]="['toast-' + toast.typeId, 'size-' + toast.size]">
                    @if (toast.typeId === 'success') {
                        <i
                            class="fas fa-check toast-icon"
                            aria-hidden="true"></i>
                    }
                    @if (toast.typeId === 'error') {
                        <i
                            class="fas fa-exclamation toast-icon"
                            aria-hidden="true"></i>
                    }

                    <!--
                        Renders ahead of the message so that it reads first both here and in the
                        announcement, which is composed from this element's rendered text.
                    -->
                    @if (getTypeLabel(toast.typeId)) {
                        <span class="sr-only">{{ getTypeLabel(toast.typeId) }}</span>
                    }

                    <!-- If templateRef render via ngTemplateOutlet-->
                    @if (isTemplateRef(toast.message)) {
                        <ng-container *ngTemplateOutlet="toast.message"></ng-container>
                    }

                    @if (!isTemplateRef(toast.message)) {
                        <p
                            class="toast-message"
                            [innerHTML]="getInnerHTML(toast.message)"></p>
                    }

                    @if (toast.isDismissable) {
                        <button
                            class="btn btn-md btn-ghost-alt btn-no-padding close-button"
                            aria-label="Dismiss notification"
                            (click)="dismiss(toast)">
                            <i
                                class="far fa-times"
                                aria-hidden="true"></i>
                        </button>
                    }
                </div>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgTemplateOutlet]
})
export class ToastsComponent {
    private _cdRef = inject(ChangeDetectorRef);
    private _domSanitizer = inject(DomSanitizer);
    private _announcer = inject(ToastAnnouncer);
    private _document = inject<Document>(DOCUMENT);

    @ViewChildren('toastEl') private _toastElements: QueryList<ElementRef<HTMLElement>>;

    public toasts: Toast[] = [];

    /**
     * What had focus when each toast was shown, so that focus can be handed back if the toast is
     * removed while the user is inside it. Kept off `Toast` to leave its public shape alone.
     */
    private _triggerElements = new WeakMap<Toast, HTMLElement>();

    isTemplateRef(value: string | TemplateRef<any>): boolean {
        return typeof value !== 'string';
    }

    getTypeLabel(typeId: string): string {
        return TYPE_LABELS[typeId] || '';
    }

    getInnerHTML(message: string): SafeHtml {
        return this._domSanitizer.bypassSecurityTrustHtml(message);
    }

    success(message: string | TemplateRef<any>): Toast {
        const toast: IToast = {
            message: message,
            typeId: 'success',
            isDismissable: false
        };
        return this.show(toast);
    }

    error(message: string | TemplateRef<any>): Toast {
        const toast: IToast = {
            message: message,
            typeId: 'error',
            isDismissable: true
        };
        return this.show(toast);
    }

    show(toast: IToast): Toast {
        const _toast = new Toast(toast);
        const trigger = this._document.activeElement;

        if (trigger instanceof HTMLElement) {
            this._triggerElements.set(_toast, trigger);
        }

        this.toasts.push(_toast);
        this._cdRef.detectChanges();
        this._announce(this.toasts.length - 1, _toast.typeId);

        if (_toast.autoDismiss) {
            setTimeout(() => {
                this.removeToast(_toast);
            }, _toast.dismissTimeout);
        }
        return _toast;
    }

    /**
     * The message text is read back off the rendered toast rather than composed from
     * `toast.message`, because a message may be a `TemplateRef` whose text is not knowable up
     * front, and a string message may contain markup. It is read synchronously, while the index is
     * known to be valid, so that a toast dismissed before the announcement lands still announces
     * the right thing.
     */
    private _announce(index: number, typeId: string): void {
        const element = this._toastElements?.get(index)?.nativeElement;

        if (!element) {
            return;
        }
        const messageText = this._getMessageText(element);

        if (!messageText) {
            return;
        }
        this._announcer.announce([this.getTypeLabel(typeId), messageText].filter(Boolean).join(' '), typeId);
    }

    /**
     * The type prefix is stripped and re-joined with a space rather than being taken from the
     * rendered text as-is: Angular drops the whitespace between the prefix and the message, so the
     * two would otherwise run together into a single word.
     */
    private _getMessageText(element: HTMLElement): string {
        const clone = element.cloneNode(true) as HTMLElement;

        clone.querySelectorAll('.sr-only').forEach(node => node.remove());

        return clone.textContent.replace(/\s+/g, ' ').trim();
    }

    dismiss(toast: Toast) {
        this.removeToast(toast);
    }

    removeToast(toast: Toast) {
        const index = this.getToastIndex(toast);

        if (index > -1) {
            this._restoreFocus(toast, index);
            this.toasts.splice(index, 1);
            this._cdRef.detectChanges();
        }
    }

    /**
     * Focus is only moved when it is currently inside the toast being removed — the user is on its
     * dismiss button — because removing the toast would otherwise drop focus to the body and lose
     * their place. A toast removed while the user is elsewhere leaves focus alone, and covers the
     * case of a focused toast auto-dismissing as well as one dismissed by hand.
     */
    private _restoreFocus(toast: Toast, index: number): void {
        const element = this._toastElements?.get(index)?.nativeElement;

        if (!element?.contains(this._document.activeElement)) {
            return;
        }
        const trigger = this._triggerElements.get(toast);

        // A trigger inside a dialog that has since closed is gone; there is nowhere to hand back to
        if (trigger?.isConnected) {
            trigger.focus();
        }
    }

    getToastIndex(toast: Toast): number {
        return this.toasts.indexOf(toast);
    }
}
