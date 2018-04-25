import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, keyframes } from "@angular/animations";
import { IToast } from "./IToast";
import { ToastsService } from "./toasts.service";

@Component({
  selector: 'nw-toasts',
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
            style({ opacity: 0, top: 0, transform: 'translate3d(0, -500px, 0)', offset: 0.8 }),
            // Give the element no apparent height to cause stacked items to animate to their new positions
            style({ height: 0, offset: 1 })
          ]))
      ])
    ])
  ]
})
export class ToastsComponent implements OnInit {

  public toasts: IToast[] = [];
  public toastTimeout: number = 3000;

  constructor(private _toaster: ToastsService) { }

  ngOnInit() {
  }

  dismiss(toast: IToast) {
    
  }

}
