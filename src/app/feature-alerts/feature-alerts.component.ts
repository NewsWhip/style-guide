import { Component } from '@angular/core';
import {WindowRef} from '../../_lib/modules/feature-alerts/windowref';

@Component({
  selector: 'app-feature-alerts',
  templateUrl: './feature-alerts.component.html',
  styleUrls: ['./feature-alerts.component.scss']
})
export class FeatureAlertsComponent {
    message: string;

    constructor(private w: WindowRef) {}

    clearLocalStorage() {
        this.w.nativeWindow.localStorage.clear();
        this.w.nativeWindow.location.reload();
    }

    getFeatureAlertParams1() {
        return {
            id: 'secondFeatureAlert',
            title: 'Second Alert',
            message: 'Too many feature alerts',
            containerClass: '',
            triggers: '',
            placement: 'right',
            container: ''
        };
    }

    getFeatureAlertParams2() {
        return {
            id: 'thirdFeatureAlert',
            title: 'Third Alert',
            message: 'Three pinky pigs',
            containerClass: '',
            triggers: '',
            placement: 'bottom',
            container: ''
        };
    }

    getFeatureAlertParams3() {
        return {
            id: 'fourthFeatureAlert',
            title: 'Fourth Alert',
            message: 'On your left.',
            containerClass: '',
            triggers: '',
            placement: 'left',
            container: ''
        };
    }

    onCTAClick1() {
        this.message = 'Clicked on call to action button in the FIRST feature alert.';
    }

    onCTAClick2() {
        this.message = 'Clicked on call to action button in the SECOND feature alert.';
    }

    onCTAClick3() {
        this.message = 'Clicked on call to action button in the THIRD feature alert.';
    }
}
