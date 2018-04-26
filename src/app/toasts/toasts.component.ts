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
}
