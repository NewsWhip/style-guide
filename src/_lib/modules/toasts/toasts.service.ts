import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Inject, ComponentRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ToastsComponent } from './toasts.component';
import { IToast } from './IToast';

@Injectable()
export class Toaster {

    private _toastPortal: ComponentPortal<ToastsComponent>;
    private _outlet: DomPortalOutlet;
    private _toastComponentRef: ComponentRef<ToastsComponent>;

    constructor(
        private _cfr: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _injector: Injector,
        @Inject(DOCUMENT) private _document: any) {

        this._toastComponentRef = this._attachOutlet();
    }

    private _attachOutlet(): ComponentRef<ToastsComponent> {
        this._toastPortal = new ComponentPortal(ToastsComponent);
        this._outlet = new DomPortalOutlet(this._document.body, this._cfr, this._appRef, this._injector);
        return this._outlet.attach(this._toastPortal);
    }

    show(toast: IToast) {
        this._toastComponentRef.instance.show(toast);
    }

    success(message: string) {
        this._toastComponentRef.instance.success(message);
    }

    error(message: string) {
        this._toastComponentRef.instance.error(message);
    }

    dismiss(toast: IToast): void {
        this._toastComponentRef.instance.dismiss(toast);
    }
}
