import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { IValidationChange } from "../../_lib/modules/email-input/models/IValidationChange";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-email-input-demo',
    templateUrl: './email-input-demo.component.html',
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

    public snippets: { [key: string]: ISnippet } = {
        import: {
            lang: 'typescript',
            code: `
                import { EmailInputModule } from 'nw-style-guide/email-input';
            `
        },
        basicExample: {
            lang: 'html',
            code: `
                <nw-email-input
                    [emails]="['test@example.com']"
                    [placeholder]="'Custom placeholder text'"
                    [inputId]="'my-email-input'"
                    (updated)="onChange($event)"></nw-email-input>
            `
        }
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
                name: `@Input() blacklist: (string | RegExp)[]`,
                defaultValue: `[]`,
                description: 'A list of strings or RegExp to be matched against the inputted list of emails. Any emails that match entries in the blacklist will be marked as invalid'
            },
            {
                name: `@Output() change: EventEmitter<IValidationChange>`,
                defaultValue: null,
                description: 'Emits a <code>IValidationChange</code>. Fired on intialization, every time the input value changes and whenever an email pill is removed.'
            },
        ]
    }

    ngOnDestroy() {
        this._routeSub.unsubscribe();
    }

}
