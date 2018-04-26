import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, transition, style, animate, keyframes } from "@angular/animations";
import { Toaster } from "../../_lib/modules/toasts";
import { IToast } from '../../_lib/modules/toasts';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent {

  public messages: string[] = [
    'Short message',
    'Medium length notification',
    'This message is a total of fifty characters long..'
  ];

  constructor(
    private _sanitizer: DomSanitizer,
    private _toaster: Toaster) {

  }

  addSuccess() {
    this._toaster.success('Some successful message');
  }

  addError() {
    this._toaster.error('Some error message');
  }

  addRandom() {
    let isErrorType = Math.random() < 0.5;

    let toast: IToast = {
      message: this.messages[Math.floor(Math.random() * this.messages.length)],
      typeId: isErrorType ? 'error' : 'success',
      isDismissable: isErrorType
    };

    this._toaster.show(toast);
  }

  get ngAnimations() {
    return this._sanitizer.bypassSecurityTrustHtml(`
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
    `)
  }
}
