import { TemplateRef } from "@angular/core";
import { IToast } from './IToast';

export class Toast implements IToast {
    message: string | TemplateRef<any>;
    typeId: string;
    isDismissable?: boolean;
    autoDismiss?: boolean = true;
    dismissTimeout?: number = 3000;
    size?: 'md';

    constructor(options: IToast) {
        Object.assign(this, options);
    }
}
