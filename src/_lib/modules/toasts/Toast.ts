import {IToast} from './IToast';

export class Toast implements IToast {
    message: string;
    typeId: string;
    isDismissable?: boolean;
    autoDismiss?: boolean = true;
    dismissTimeout?: number = 3000;

    constructor(options: IToast) {
        Object.assign(this, options);
    }
}
