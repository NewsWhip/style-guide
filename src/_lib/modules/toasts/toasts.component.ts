import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {IToast} from './IToast';
import {Toast} from './Toast';

@Component({
    selector: 'nw-toasts',
    template: `
        <div class="toasts-container">
            <div class="toast toast-{{toast.typeId}}" *ngFor="let toast of toasts" [@slideInOut]>
                <i class="fa fa-check toast-icon" *ngIf="toast.typeId === 'success'"></i>
                <i class="fa fa-exclamation toast-icon" *ngIf="toast.typeId === 'error'"></i>
                <p class="toast-message">{{toast.message}}</p>
                <button class="close" *ngIf="toast.isDismissable" (click)="dismiss(toast)">&times;</button>
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastsComponent {

    public toasts: Toast[] = [];

    constructor(private _cdRef: ChangeDetectorRef) { }

    success(message: string): Toast {
        const toast: Toast = new Toast({
            message: message,
            typeId: 'success',
            isDismissable: false
        });
        return this.show(toast);
    }

    error(message: string): Toast {
        const toast: Toast = new Toast({
            message: message,
            typeId: 'error',
            isDismissable: true
        });
        return this.show(toast);
    }

    show(toast: Toast): Toast {
        this.toasts.push(toast);
        this._cdRef.detectChanges();

        if (toast.autoDismiss) {
            setTimeout(() => {
                this.removeToast(toast);
            }, toast.dismissTimeout);
        }
        return toast;
    }

    dismiss(toast: Toast) {
        this.removeToast(toast);
    }

    removeToast(toast: Toast) {
        const index = this.toasts.indexOf(toast);

        if (index > -1) {
            this.toasts.splice(index, 1);
            this._cdRef.detectChanges();
        }
    }

}
