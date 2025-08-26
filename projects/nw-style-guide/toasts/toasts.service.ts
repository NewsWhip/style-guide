import { Injectable, ApplicationRef, Injector, TemplateRef } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ToastsComponent } from './toasts.component';
import { IToast } from './IToast';
import { Toast } from './Toast';
import { IToastConfig } from './IToastConfig';
import { defaultConfig } from './config';

@Injectable()
export class Toaster {

    private _toastPortal: ComponentPortal<ToastsComponent>;
    private _outlet: DomPortalOutlet;
    private _toastsComponentRef: ToastsComponent;
    private _config: IToastConfig;

    constructor(
        private _appRef: ApplicationRef,
        private _injector: Injector) {}

    private _attachOutlet(): ToastsComponent {
        /**
         * If the `ToastsComponent` already exists return it
         */
        if (this._toastsComponentRef) {
            return this._toastsComponentRef;
        }
        this._config = this._config || defaultConfig;
        this._toastPortal = new ComponentPortal(ToastsComponent);
        this._outlet = new DomPortalOutlet(this._config.outletElement, undefined, this._appRef, this._injector);
        this._toastsComponentRef = this._outlet.attach(this._toastPortal).instance;
        return this._toastsComponentRef;
    }

    show(toast: IToast): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.show(toast);
    }

    success(message: string | TemplateRef<any>): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.success(message);
    }

    error(message: string | TemplateRef<any>): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.error(message);
    }

    dismiss(toast: Toast): void {
        this._toastsComponentRef.dismiss(toast);
    }

    isToastActive(toast: Toast): boolean {
        return this._toastsComponentRef.getToastIndex(toast) > -1;
    }

    /**
     * Set the configuration values for a `Toaster` instance. This can only be called once
     * per `Toaster` instance and must be called before the outlet is created
     *
     * @param config Configuration settings for the Toaster
     */
    setConfig(config: IToastConfig): void {
        if (!this._config) {
            this._config = config;
        } else {
            console.warn(`config has already been set for this Toaster instance with a value of`, this._config);
        }
    }
}
