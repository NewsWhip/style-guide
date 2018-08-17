export class IToast {
    message: string;
    typeId: string;
    isDismissable?: boolean;
    autoDismiss?: boolean;
    dismissTimeout?: number;
}
