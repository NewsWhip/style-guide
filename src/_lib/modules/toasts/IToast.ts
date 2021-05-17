import { TemplateRef } from "@angular/core";

export class IToast {
    message: string | TemplateRef<any>;
    typeId: string;
    isDismissable?: boolean;
    autoDismiss?: boolean;
    dismissTimeout?: number;
    size?: 'sm' | 'md';
}
