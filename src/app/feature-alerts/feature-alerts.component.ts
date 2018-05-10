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
            id: 'firstFA',
            title: 'First Alert',
            message: 'Too many feature alerts',
            placement: 'right',
            isBlockEl: true
        };
    }

    getFeatureAlertParams2() {
        return {
            id: 'secondFA',
            title: 'Second Alert',
            message: 'On your left.',
            placement: 'left',
            isBlockEl: true
        };
    }

    getFeatureAlertParams3() {
        return {
            id: 'thirdFA',
            title: 'Second Alert',
            message: 'The `isBlockEl` flag is not defined here, so the feature alert treats the anchor as inline element.',
            placement: 'bottom',
            containerClass: 'feat-alert-max-width-300',
        };
    }

    getFeatureAlertParams4() {
        return {
            id: 'firstInlineFA',
            title: 'Inline Feature Alert',
            message: 'This is inline element.',
            placement: 'top',
            containerClass: 'feat-alert-for-inline-element'
        };
    }

    getFeatureAlertParams5() {
        return {
            id: 'secondInlineFA',
            title: 'Inline Feature Alert no. 2',
            message: 'This is another inline element. Enjoy!',
            placement: 'right',
            containerClass: 'feat-alert-for-inline-element'
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

    onCTAClick4() {
        this.message = 'Clicked on call to action button in the FIRST INLINE em element.';
    }

    onCTAClick5() {
        this.message = 'Clicked on call to action button in the SECOND INLINE em element.';
    }
}
