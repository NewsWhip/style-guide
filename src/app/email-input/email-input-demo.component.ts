import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { WindowRef } from '../../_lib/modules/feature-alerts/windowref';
import { IValidationChange } from "../../_lib/modules/email-input/models/IValidationChange";

@Component({
    selector: 'app-email-input-demo',
    template: `
        <h2 class="page-header">Email Input</h2>

        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="form-group">
                    <label for="email-input">Email input</label>
                    <nw-email-input
                        [emails]="emails"
                        placeholder="Custom placeholder text"
                        inputId="email-input"
                        (change)="onChange($event)"></nw-email-input>
                </div>
            </div>

            <div class="col-md-6 col-sm-12">
                <p class="nw-text">State: <strong>{{validationState.isValid? 'valid': 'invalid'}}</strong></p>
                <p class="nw-text">Input state: <strong>{{validationState.control?.status}}</strong></p>
                <p class="nw-text">Input value: <strong>{{validationState.control?.value}}</strong></p>
                <p class="nw-text">Is pristine: <strong>{{validationState.control?.pristine}}</strong></p>
                <p class="nw-text">Is dirty: <strong>{{validationState.control?.dirty}}</strong></p>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailInputDemoComponent {

    public emails: string[] = [];
    public validationState: IValidationChange;

    constructor(private _cdRef: ChangeDetectorRef) {}

    onChange(event: IValidationChange) {
        this.validationState = event;
        this._cdRef.detectChanges();
    }

}
