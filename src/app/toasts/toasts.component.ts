import { Component, TemplateRef } from '@angular/core';
import { Toaster } from '../../_lib/modules/toasts';
import { IToast } from '../../_lib/modules/toasts';
import { Toast } from '../../_lib/modules/toasts/Toast';

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

  private _dismissibleOnDemandToast: Toast;

  constructor(private _toaster: Toaster) {}

  addSuccess() {
    this._toaster.success('A successful message');
  }

  addError() {
    this._toaster.error('Some error message');
  }

  addRandom() {
    const isErrorType = Math.random() < 0.5;

    const toast: IToast = {
      message: this.messages[Math.floor(Math.random() * this.messages.length)],
      typeId: isErrorType ? 'error' : 'success',
      isDismissable: isErrorType
    };

    this._toaster.show(toast);
  }

  addCustomToast() {
    this._toaster.success('<i class="fa fa-snowflake-o"></i> Toast with icon');
  }

  addTemplateRefToast(ref: TemplateRef<any>) {
    this._toaster.error(ref);
  }

  dismissOnDemand() {
      this._toaster.dismiss(this._dismissibleOnDemandToast);
  }

  addDismissibleOnDemand() {
      this._dismissibleOnDemandToast = this._toaster.show({
          typeId: 'error',
          message: 'This message is dismissible on demand.',
          autoDismiss: false
      });
  }
}
