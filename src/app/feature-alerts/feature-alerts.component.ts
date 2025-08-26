import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FeatureAlertsService, WindowRef } from 'nw-style-guide/feature-alerts';

@Component({
    selector: 'app-feature-alerts',
    templateUrl: './feature-alerts.component.html',
    styleUrls: ['./feature-alerts.component.scss'],
    styles: [`
        :host ::ng-deep .feature-alert.feat-alert-for-inline-element{
            border: 1px solid black;
            min-width: 300px;
        }

        :host ::ng-deep .feat-alert-max-width-300{
            max-width: 300px;
            border: 1px solid green;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FeatureAlertsComponent {
    message: string;

    featureAlertIds: string[] = ['example-feature-1', 'example-feature-2'];
    showResetButton: boolean;

    constructor(
        private w: WindowRef,
        private _featureAlertService: FeatureAlertsService
    ) {}

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

    dismissFeature(id: string) {
        this._featureAlertService.dismiss(id);
        this.showResetButton = true;
    }

    resetFeatureAlert() {
        this.featureAlertIds.forEach(id => this._featureAlertService.enable(id));
        this.showResetButton = false;
    }
}
