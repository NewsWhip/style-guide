import { Injectable, inject } from '@angular/core';
import { WindowRef } from './windowref';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FeatureAlertsService {
    private _w = inject(WindowRef);

    LOCAL_STORAGE_KEY = 'nwAlerts';

    private _dismissSubject = new Subject<string>();
    public dismiss$ = new Observable<string>();

    constructor() {
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

        if (alerts && Object.hasOwn(alerts, id)) {
            return alerts[id].dismissed;
        }
        return false;
    }

    private _get(): Record<string, { dismissed: boolean }> | null {
        return JSON.parse(this._w.nativeWindow.localStorage.getItem(this.LOCAL_STORAGE_KEY) ?? 'null');
    }

    private _set(alerts: Record<string, { dismissed: boolean }>) {
        this._w.nativeWindow.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(alerts));
    }
}
