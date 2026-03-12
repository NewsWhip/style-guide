export { Toaster } from './toasts.service';
export { IToast } from './IToast';
export { Toast } from './Toast';
export { IToastConfig } from './IToastConfig';

import { Provider } from '@angular/core';
import { Toaster } from './toasts.service';

export function provideToasts(): Provider[] {
    return [Toaster];
}
