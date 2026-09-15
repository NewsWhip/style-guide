import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    FeatureAlertsDirective,
    FeatureAlertsService,
    HotspotComponent,
    WindowRef
} from 'nw-style-guide/feature-alerts';
import { AppCodeComponent } from '../code/code.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-feature-alerts',
    templateUrl: './feature-alerts.component.html',
    styleUrls: ['./feature-alerts.component.scss'],
    styles: [
        `
            :host ::ng-deep .feature-alert.feat-alert-for-inline-element {
                border: 1px solid black;
                min-width: 300px;
            }

            :host ::ng-deep .feat-alert-max-width-300 {
                max-width: 300px;
                border: 1px solid green;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HotspotComponent, FeatureAlertsDirective, AppCodeComponent]
})
export class FeatureAlertsComponent {
    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { FeatureAlertsDirective } from 'nw-style-guide/feature-alerts';`
    };

    readonly directiveExampleSnippet: ISnippet = {
        lang: 'html',
        code: `<span *nwFeatureAlert="'my-feature-id'" class="label label-round label-new">
    New
</span>`
    };

    readonly hotspotExampleSnippet: ISnippet = {
        lang: 'html',
        code: `<button class="btn btn-primary" style="position: relative"
    (click)="hotspot.dismiss()">
    Click me
    <nw-hotspot #hotspot id="my-hotspot" position="top"></nw-hotspot>
</button>`
    };

    private _w = inject(WindowRef);
    private _featureAlertService = inject(FeatureAlertsService);

    message: string;

    featureAlertIds: string[] = ['example-feature-1', 'example-feature-2'];
    showResetButton: boolean;

    clearLocalStorage() {
        this._w.nativeWindow.localStorage.clear();
        this._w.nativeWindow.location.reload();
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
