import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, transition, style, animate, keyframes } from "@angular/animations";

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
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
            style({ opacity: 0, transform: 'translate3d(0, -500px, 0)', offset: 0.8 }),
            // Give the element no apparent height to cause stacked items to animate to their new positions
            style({ height: 0, padding: 0, margin: 0, offset: 1 })
          ]))
      ])
    ])
  ]
})
export class ToastsComponent {

  public toasts: Toast[] = [];
  public toastTimeout: number = 3000;
  public messages: string[] = [
    'Short message',
    'Medium length notification',
    'This message is a total of fifty characters long..'
  ];

  constructor(private _sanitizer: DomSanitizer) {
    this.toasts = [];
  }

  addSuccess() {
    let toast = {
      message: 'Some successful message',
      typeId: 'success',
      isDismissable: false
    };

    this.add(toast);
  }

  addError() {
    let toast = {
      message: 'Some error message',
      typeId: 'error',
      isDismissable: true
    };

    this.add(toast);
  }

  addRandom() {
    let isErrorType = Math.random() < 0.5;

    let toast = {
      message: this.messages[Math.floor(Math.random() * this.messages.length)],
      typeId: isErrorType ? 'error' : 'success',
      isDismissable: isErrorType
    };

    this.add(toast);
  }

  add(toast: Toast) {
    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast)
    }, this.toastTimeout)
  }

  dismiss(toast: Toast) {
    this.removeToast(toast);
  }

  removeToast(toast: Toast) {
    let index = this.toasts.indexOf(toast);
    this.toasts.splice(index, 1);
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
      style({ opacity: 0, transform: 'translate3d(0, -500px, 0)', offset: 0.8 }),
      // Give the element no apparent height to cause stacked items to animate to their new positions
      style({ height: 0, padding: 0, margin: 0, offset: 1 })
    ]))
])
    `)
  }
}

interface Toast {
  message: string
  typeId: string 
  isDismissable?: boolean
}
