export class IToast {
    message: string;
    typeId: string;
    isDismissable?: boolean;
    autoDismiss?: boolean = true;
    timeout?: number = 3000;
}
