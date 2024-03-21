import { Injectable } from '@angular/core';
import { WindowRef } from './windowref';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FeatureAlertsService {
    LOCAL_STORAGE_KEY = 'nwAlerts';

    private _dismissSubject = new Subject<string>();
    public dismiss$ = new Observable<string>();

    constructor(private _w: WindowRef) {
        this.dismiss$ = this._dismissSubject.asObservable();
    }

    dismiss(id: string) {
        this._set({
            ...this._get(),
            [id]: { dismissed: true }
        });
        this._dismissSubject.next(id);
    }

    enable(id: string) {
        this._set({
            ...this._get(),
            [id]: { dismissed: false }
        });
        this._dismissSubject.next(id);
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
