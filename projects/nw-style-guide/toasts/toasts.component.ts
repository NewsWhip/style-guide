import {ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {IToast} from './IToast';
import {Toast} from './Toast';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'nw-toasts',
    template: `
        <div class="toasts-container">
            <div class="toast" *ngFor="let toast of toasts" [@slideInOut]
                [ngClass]="['toast-' + toast.typeId, 'size-' + toast.size]">
                <i class="fas fa-check toast-icon" *ngIf="toast.typeId === 'success'"></i>
                <i class="fas fa-exclamation toast-icon" *ngIf="toast.typeId === 'error'"></i>

                <!-- If templateRef render via ngTemplateOutlet-->
                <ng-container *ngIf="isTemplateRef(toast.message)">
                    <ng-container *ngTemplateOutlet="toast.message"></ng-container>
                </ng-container>

                <p *ngIf="!isTemplateRef(toast.message)" class="toast-message" [innerHTML]="getInnerHTML(toast.message)"></p>

                <button class="btn btn-md btn-ghost-alt btn-no-padding close-button" *ngIf="toast.isDismissable" (click)="dismiss(toast)">
                    <i class="far fa-times"></i>
                </button>
            </div>
        </div>
    `,
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                animate('0.6s cubic-bezier(0.68, 0, 0.265, 1.75)', keyframes([
                    style({ opacity: 0, transform: 'translate3d(0, -100px, 0)', offset: 0 }),
                    style({ opacity: 1, transform: 'translate3d(0, -66px, 0)', offset: 0.33 }),
                    style({ transform: 'translate3d(0, 0, 0)', offset: 1 })
                ]))
            ]),
            transition(':leave', [
                animate('0.8s linear', keyframes([
                    style({ opacity: 0, top: 0, transform: 'translate3d(0, -500px, 0)', offset: 0.8 }),
                    // Give the element no apparent height to cause stacked items to animate to their new positions
                    style({ height: 0, offset: 1 })
                ]))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ToastsComponent {

    public toasts: Toast[] = [];

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _domSanitizer: DomSanitizer) { }

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
