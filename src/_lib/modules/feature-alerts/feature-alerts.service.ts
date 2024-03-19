import { Injectable } from '@angular/core';
import { WindowRef } from './windowref';

@Injectable()
export class FeatureAlertsService {
    LOCAL_STORAGE_KEY = 'nwAlerts';

    constructor(private _w: WindowRef) {}

    dismiss(id: string) {
        this._set({
            ...this._get(),
            [id]: { dismissed: true }
        });
    }

    wasAlertDismissed(id: string): boolean {
        const alerts = this._get();

        if (alerts && alerts.hasOwnProperty(id)) {
            return alerts[id].dismissed;
        }
    }

    private _get(): object {
        return JSON.parse(this._w.nativeWindow.localStorage.getItem(this.LOCAL_STORAGE_KEY));
    }

    private _set(alerts: object) {
        this._w.nativeWindow.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(alerts));
    }
}
