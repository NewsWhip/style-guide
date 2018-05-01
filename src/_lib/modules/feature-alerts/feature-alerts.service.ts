import { Injectable } from '@angular/core';
import { WindowRef } from './windowref';

@Injectable()
export class FeatureAlertsService {
    LOCAL_STORAGE_KEY = 'nwAlerts';

    constructor(private w: WindowRef) {}

    persist(id: string) {
        this.set({
            ...this.get(),
            [id]: { dismissed: true }
        });
    }

    wasAlertDismissed(id: string): boolean {
        const alerts = this.get();

        if (alerts && alerts.hasOwnProperty(id)) {
            return alerts[id].dismissed;
        }
    }

    private get(): Object {
        return JSON.parse(this.w.nativeWindow.localStorage.getItem(this.LOCAL_STORAGE_KEY));
    }

    private set(alerts: Object) {
        this.w.nativeWindow.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(alerts));
    }
}
