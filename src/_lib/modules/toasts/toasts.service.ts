import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { ComponentPortal, DomPortalOutlet } from "@angular/cdk/portal";
import { ToastsComponent } from './toasts.component';

@Injectable()
export class ToastsService {

  private _toastPortal: ComponentPortal<ToastsComponent>;
  private _outlet: DomPortalOutlet;

  constructor(
    private _cfr: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    @Inject(DOCUMENT) private _document: any) {

    this._outlet = new DomPortalOutlet(this._document.body, this._cfr, this._appRef, this._injector);
  }

  show() {
    this._toastPortal = new ComponentPortal(ToastsComponent);
    this._outlet.attach(this._toastPortal);
  }

}
