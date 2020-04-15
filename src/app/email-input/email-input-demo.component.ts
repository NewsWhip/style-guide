import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { IValidationChange } from "../../_lib/modules/email-input/models/IValidationChange";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-email-input-demo',
    template: `
        <div class="page-header" style="padding-bottom: 0;">
            <h3 class="nw-text nw-text-light">Email Input</h3>

            <p class="nw-text">This is an input that a user can use to input multiple email in a form</p>
            <p class="nw-text"><strong>Used in</strong>: Spike Export PDF to input emails</p>

            <div class="tabs-container">
                <nw-tabs size="md">
                    <li nwTab [isActive]="selectedTab === 'design'" role="presentation">
                        <a [routerLink]="['.']" [queryParams]="{section: 'design'}" role="tab">Design</a>
                    </li>
                    <li nwTab [isActive]="selectedTab === 'api'" role="presentation">
                        <a [routerLink]="['.']" [queryParams]="{section: 'api'}"  role="tab">API</a>
                    </li>
                </nw-tabs>
            </div>
        </div>

        <div *ngIf="selectedTab === 'design'" class="tab-content">
            <h4 class="nw-text" style="margin-bottom: 16px;">Live example</h4>

            <div class="row">
                <div class="col-md-6 col-sm-12">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="email-input">Input Label</label>
                        <nw-email-input
                            [emails]="emails"
                            placeholder="Custom placeholder text"
                            inputId="email-input"
                            (updated)="onChange($event)"></nw-email-input>
                    </div>
                </div>
            </div>

            <hr>

            <h3 class="nw-text" style="margin-bottom: 16px;">Description</h3>

            <p class="nw-text" style="margin-bottom: 16px;">An email input should be</p>

            <ol style="margin-bottom: 32px;" class="guidelines">
                <li>
                    <h5 class="nw-text" style="display: inline-block;">Discoverable</h5>
                    <p class="nw-text">It should be easy to distinguish between elements that can have textual input vs. those that cannot.</p>
                </li>
                <li>
                    <h5 class="nw-text" style="display: inline-block;">Clear</h5>
                    <p class="nw-text">Email input states should be clearly differentiated from one another.</p>
                </li>
                <li>
                    <h5 class="nw-text" style="display: inline-block;">Efficient</h5>
                    <p class="nw-text">Email inputs should make it easy to understand the requested information and to address any errors.</p>
                </li>
                <li>
                    <h5 class="nw-text" style="display: inline-block;">Editable</h5>
                    <p class="nw-text">An email input should be easily editable to enable the user to correct any errors.</p>
                </li>
            </ol>

            <hr>

            <h4 class="nw-text" style="margin-bottom: 16px;">Usage</h4>

            <p class="nw-text" style="margin-bottom: 16px;">
                When a user wants to add multiple emails at once they will enter text and then either use a
                <strong>comma, semicolon, space, enter or tab to confirm the input</strong>
            </p>

            <ol style="margin-bottom: 32px;">
                <li>If the text is a valid email then create a blue tag as shown below</li>
                <li>If the text is an invalid then create a red tag as shown below</li>
            </ol>
        </div>

        <div *ngIf="selectedTab === 'api'" class="tab-content">
            <div class="demo-section">
                <div class="row">
                    <div class="col-md-8 col-sm-12">
                        <h4 class="nw-text">Importing</h4>
                        <app-copy-code>{{importModule}}</app-copy-code>
                    </div>
                </div>
            </div>
            <hr>
            <div class="demo-section">
                <div class="row">
                    <div class="col-md-8 col-sm-12">
                        <h4 class="nw-text">Basic example</h4>
                        <app-copy-code>{{example}}</app-copy-code>
                    </div>
                </div>
            </div>
            <hr>
            <div class="demo-section">
                <h4 class="nw-text">Validation</h4>
                <p class="nw-text">Email validation is handled by Angular's built-in email validator.</p>
            </div>
            <hr>
            <div class="demo-section">
                <div class="row">
                    <div class="col-md-8 col-sm-12">
                        <h4 class="nw-text">Properties</h4>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Default value</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let prop of properties">
                                    <td><code class="light">{{prop.name}}</code></td>
                                    <td>
                                        <code class="light" *ngIf="prop.defaultValue">{{prop.defaultValue}}</code>
                                        <em *ngIf="!prop.defaultValue">N/A</em>
                                    </td>
                                    <td [innerHTML]="prop.description"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <hr>
            <div class="demo-section">
                <h4 class="nw-text">Classes / Interfaces</h4>

                <div class="row">
                    <div class="col-md-8 col-sm-12">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th colspan="2" style="text-transform: initial;">
                                        IValidationChange interface
                                    </th>
                                </tr>
                                <tr>
                                    <th>Property</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><code class="light">isValid: boolean</code></td>
                                    <td>Is <code>true</code> if there is at least one email and and all emails are valid.</td>
                                </tr>
                                <tr>
                                    <td><code class="light">emails: string[]</code></td>
                                    <td>All emails pills including staged text that has been typed into the input.</td>
                                </tr>
                                <tr>
                                    <td><code class="light">control: FormControl</code></td>
                                    <td>The <code>FormControl</code> instance.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        li {
            font-size: 14px;
        }
        ol li {
            margin-bottom: 16px;
        }
    `]
})
export class EmailInputDemoComponent implements OnInit {

    public emails: string[] = [
        "valid.email@newswhip.com",
        "invalid.email"
    ];
    public validationState: IValidationChange;
    public selectedTab: 'design' | 'api' = 'design';
    public properties: { name: string; defaultValue: string; description: string }[];

    private _routeSub: Subscription;

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _route: ActivatedRoute) {}

    ngOnInit() {
        this.properties = this._getProperties();

        this._routeSub = this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    onChange(event: IValidationChange) {
        this.validationState = event;
        this._cdRef.detectChanges();
    }

    get importModule() {
        return `import { EmailInputModule } from 'nw-style-guide/email-input';`
    }

    get example() {
        return `<nw-email-input placeholder="Custom placeholder text"></nw-email-input>`
    }

    private _getProperties(): { name: string; defaultValue: string; description: string }[] {
        return [
            {
                name: '@Input() emails: string[] = []',
                defaultValue: "[]",
                description: 'Collection of strings that the component should be initialized with.'
            },
            {
                name: '@Input() inputId: string',
                defaultValue: `""`,
                description: 'Applied to the <code>HTMLInputElement</code>. Mostly useful for label using the <code>for</code> attribute.'
            },
            {
                name: `@Input() placeholder: string`,
                defaultValue: `""`,
                description: 'Placeholder text applied to the empty input.'
            },
            {
                name: `@Output() change: EventEmitter<IValidationChange>`,
                defaultValue: null,
                description: 'Emits a <code>IValidationChange</code>. Fired on intialization, every time the input value changes and whenever an email pill is removed.'
            }
        ]
    }

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }

}
