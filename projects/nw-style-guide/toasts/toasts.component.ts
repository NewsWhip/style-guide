import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, inject } from '@angular/core';
import { IToast } from './IToast';
import { Toast } from './Toast';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'nw-toasts',
    template: `
        <div class="toasts-container">
            @for (toast of toasts; track toast) {
                <div
                    class="toast"
                    animate.enter="toast-animate-in"
                    animate.leave="toast-animate-out"
                    [ngClass]="['toast-' + toast.typeId, 'size-' + toast.size]">
                    @if (toast.typeId === 'success') {
                        <i class="fas fa-check toast-icon"></i>
                    }
                    @if (toast.typeId === 'error') {
                        <i class="fas fa-exclamation toast-icon"></i>
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
                            (click)="dismiss(toast)">
                            <i class="far fa-times"></i>
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

    public toasts: Toast[] = [];

    isTemplateRef(value: string | TemplateRef<any>): boolean {
        return typeof value !== 'string';
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

        this.toasts.push(_toast);
        this._cdRef.detectChanges();

        if (_toast.autoDismiss) {
            setTimeout(() => {
                this.removeToast(_toast);
            }, _toast.dismissTimeout);
        }
        return _toast;
    }

    dismiss(toast: Toast) {
        this.removeToast(toast);
    }

    removeToast(toast: Toast) {
        const index = this.getToastIndex(toast);

        if (index > -1) {
            this.toasts.splice(index, 1);
            this._cdRef.detectChanges();
        }
    }

    getToastIndex(toast: Toast): number {
        return this.toasts.indexOf(toast);
    }
}
