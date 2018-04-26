import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, animate, style, keyframes } from "@angular/animations";
import { IToast } from "./IToast";
import { Toaster } from "./toasts.service";

@Component({
    selector: 'nw-toasts',
    templateUrl: './toasts.component.html',
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                animate("0.6s cubic-bezier(0.68, 0, 0.265, 1.75)", keyframes([
                    style({ opacity: 0, transform: 'translate3d(0, -100px, 0)', offset: 0 }),
                    style({ opacity: 1, transform: 'translate3d(0, -66px, 0)', offset: 0.33 }),
                    style({ transform: 'translate3d(0, 0, 0)', offset: 1 })
                ]))
            ]),
            transition(':leave', [
                animate("0.8s linear", keyframes([
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

    public toasts: IToast[] = [];
    public toastTimeout: number = 3000;

    constructor(private _cdRef: ChangeDetectorRef) { }

    success(message: string) {
        let toast: IToast = {
            message: 'Some successful message',
            typeId: 'success',
            isDismissable: false
        };
        this.show(toast);
    }

    error(message: string) {
        let toast: IToast = {
            message: 'Some error message',
            typeId: 'error',
            isDismissable: true
        };
        this.show(toast);
    }

    show(toast: IToast) {
        this.toasts.push(toast);
        this._cdRef.detectChanges();

        setTimeout(() => {
            this.removeToast(toast)
        }, this.toastTimeout);
    }

    dismiss(toast: IToast) {
        this.removeToast(toast);
    }

    removeToast(toast: IToast) {
        let index = this.toasts.indexOf(toast);

        if (index > -1) {
            this.toasts.splice(index, 1);
            this._cdRef.detectChanges();
        }
    }

}
