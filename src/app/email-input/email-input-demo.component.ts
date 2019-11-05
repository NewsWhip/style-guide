import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { IValidationChange } from "../../_lib/modules/email-input/models/IValidationChange";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-email-input-demo',
    template: `
        <h2 class="page-header">Email Input</h2>

        <nw-tabs size="md" class="demo-tabs">
            <li nwTab [isActive]="selectedTab === 'design'" role="presentation">
                <a [routerLink]="['.']" [queryParams]="{section: 'design'}" role="tab">Design</a>
            </li>
            <li nwTab [isActive]="selectedTab === 'api'" role="presentation">
                <a [routerLink]="['.']" [queryParams]="{section: 'api'}"  role="tab">API</a>
            </li>
        </nw-tabs>

        <div class="tab-container">
            <div *ngIf="selectedTab === 'design'" class="tab-content">
                <p class="nw-text text-large" style="margin-bottom: 32px;">
                    A custom input component that automatically validates inputs as emails and renders them as pills inside the input.
                </p>
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="form-group">
                            <label for="email-input">Input label</label>
                            <nw-email-input
                                [emails]="emails"
                                placeholder="Custom placeholder text"
                                inputId="email-input"
                                (change)="onChange($event)"></nw-email-input>
                        </div>
                    </div>
                </div>

                <div class="demo-section">
                    <h4 class="nw-text">Splitting text into pills</h4>
                    <p class="nw-text">The input text is rendered as a pill through submitting the following keypresses<br>
                        <kbd>,</kbd>, <kbd>Enter</kbd>, <kbd>Tab</kbd>, <kbd>Space</kbd> or <kbd>;</kbd>.
                    </p>
                    <p class="nw-text">Pills are also rendered on input blur and on tab.</p>
                </div>

                <div class="demo-section">
                    <h4 class="nw-text">Pasting text</h4>
                    <p class="nw-text">Text pasted into the input is split into individual email pills wherever a <code>,</code>, <code>;</code> or whitespace is encountered.</p>
                </div>

                <div class="demo-section">
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <h4 class="nw-text">Notes</h4>
                            <ul>
                                <li>The <kbd>Esc</kbd> key clears any text input that has not been rendered as a pill.</li>
                                <li>When pasting text, if the last email is not valid, the text is entered into the input instead of being rendered as a pill.</li>
                                <li>The component will remove any duplicate emails and will prevent duplicates from being added.</li>
                                <li>
                                    The <kbd>Backspace</kbd> key has three distinct functions
                                    <ul>
                                        <li>When pressed while text is in the input, it behaves traditionally.</li>
                                        <li>When pressed while there is no text in the input, it will select the last pill.</li>
                                        <li>When pressed while there is a pill selected, it will remove the selected pill.</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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
                <div class="demo-section">
                    <div class="row">
                        <div class="col-md-8 col-sm-12">
                            <h4 class="nw-text">Basic example</h4>
                            <app-copy-code>{{example}}</app-copy-code>
                        </div>
                    </div>
                </div>

                <div class="demo-section">
                    <h4 class="nw-text">Validation</h4>
                    <p class="nw-text">Email validation is handled by Angular's built-in email validator.</p>
                </div>

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
        </div>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailInputDemoComponent implements OnInit {

    public emails: string[] = [];
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
