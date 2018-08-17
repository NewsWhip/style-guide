import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Inject, ComponentRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ToastsComponent } from './toasts.component';
import { IToast } from './IToast';
import { Toast } from './Toast';

@Injectable()
export class Toaster {

    private _toastPortal: ComponentPortal<ToastsComponent>;
    private _outlet: DomPortalOutlet;
    private _toastsComponentRef: ComponentRef<ToastsComponent>;

    constructor(
        private _cfr: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _injector: Injector,
        @Inject(DOCUMENT) private _document: any) {

        this._toastsComponentRef = this._attachOutlet();
    }

    private _attachOutlet(): ComponentRef<ToastsComponent> {
        this._toastPortal = new ComponentPortal(ToastsComponent);
        this._outlet = new DomPortalOutlet(this._document.body, this._cfr, this._appRef, this._injector);
        return this._outlet.attach(this._toastPortal);
    }

    show(toast: IToast): Toast {
        return this._toastsComponentRef.instance.show(toast);
    }

    success(message: string): Toast {
        return this._toastsComponentRef.instance.success(message);
    }

    error(message: string): Toast {
        return this._toastsComponentRef.instance.error(message);
    }

    dismiss(toast: IToast): void {
        this._toastsComponentRef.instance.dismiss(toast);
    }

    isToastActive(toast: Toast): boolean {
        return this._toastsComponentRef.instance.getToastIndex(toast) > -1;
    }
}
