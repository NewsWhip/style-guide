import { Injectable, ApplicationRef, Injector, TemplateRef, inject, ComponentRef, createComponent } from '@angular/core';
import { ToastsComponent } from './toasts.component';
import { IToast } from './IToast';
import { Toast } from './Toast';
import { IToastConfig } from './IToastConfig';
import { defaultConfig } from './config';

@Injectable()
export class Toaster {

    private _toastsComponentRef: ComponentRef<ToastsComponent>;
    private _config: IToastConfig;
    private _appRef = inject(ApplicationRef);
    private _injector = inject(Injector);

    private _attachOutlet(): ToastsComponent {
        /**
         * If the `ToastsComponent` already exists return it
         */
        if (this._toastsComponentRef) {
            return this._toastsComponentRef.instance;
        }
        this._config = this._config || defaultConfig;
        const componentRef = createComponent(ToastsComponent, {
            environmentInjector: this._appRef.injector,
            elementInjector: this._injector
        });

        this._appRef.attachView(componentRef.hostView);
        const outlet = this._config?.outletElement;
        outlet.appendChild(componentRef.location.nativeElement);
        this._toastsComponentRef = componentRef;
        return componentRef.instance;
    }

    show(toast: IToast): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.instance.show(toast);
    }

    success(message: string | TemplateRef<any>): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.instance.success(message);
    }

    error(message: string | TemplateRef<any>): Toast {
        this._attachOutlet();
        return this._toastsComponentRef.instance.error(message);
    }

    dismiss(toast: Toast): void {
        this._toastsComponentRef.instance.dismiss(toast);
    }

    isToastActive(toast: Toast): boolean {
        return this._toastsComponentRef.instance.getToastIndex(toast) > -1;
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
