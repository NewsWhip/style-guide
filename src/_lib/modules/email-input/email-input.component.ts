import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { IValidationChange } from "./models/IValidationChange";
import { Subscription } from 'rxjs';

@Component({
    selector: 'nw-email-input',
    template: `
        <div class="emails-container form-control input-lg" #container
            [class.show-placeholder]="emails.length < 1 && emailInputControl.value.length < 1"
            (click)="onContainerClick($event)"
            (paste)="onPaste($event)"
            [attr.data-placeholder-text]="placeholder">

            <div class="pill pill-sm" *ngFor="let email of emails; let last = last;"
                [class.invalid]="!isValid(email)"
                [class.selected]="last && isPillSelected">
                <span class="pill-label">{{email}}</span>
                <button class="close" (click)="removeEmail(email)">×</button>
            </div>

            <div class="input-container">
                <!-- pill-hidden is an invisble element that controls the width of the input -->
                <div class="pill pill-sm pill-hidden">{{emailInputControl.value}}</div>
                <input type="text" #inputEl [id]="inputId"
                    [formControl]="emailInputControl"
                    (keydown)="onKeydown($event)"
                    (keydown.tab)="onTab($event)"
                    (keyup.backspace)="onBackspace()"
                    (blur)="onBlur()">
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'nw-email-input'
})
export class EmailInputComponent implements OnInit, OnDestroy {

    @Input() emails: string[] = [];
    /**
     * Applied to the HTMLInputElement. Mostly useful for label using the "for" attribute
     */
    @Input() inputId: string = "";
    @Input() placeholder: string = '';
    /**
     * A list of strings or RegExp to be matched against the inputted list of emails. Any emails that
     * match entries in the blacklist will be marked as invalid
     */
    @Input() blacklist: (string | RegExp)[] = [];

    @Output() updated: EventEmitter<IValidationChange> = new EventEmitter();

    @ViewChild('inputEl', { static: true }) inputEl: ElementRef;
    @ViewChild('container', { static: true }) container: ElementRef;

    public emailInputControl: FormControl = new FormControl("", Validators.email);
    public isPillSelected: boolean = false;

    private _validationFormControl: FormControl = new FormControl();
    private _submitKeys: string[] = [",", "Enter", " ", ";"];
    private _valueChangesSub: Subscription;

    constructor(private _cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this._subscribeToValueChanges();
        this._emitValidationChange();
    }

    private _subscribeToValueChanges() {
        this._valueChangesSub = this.emailInputControl.valueChanges.subscribe(value => {
            if (value.length > 0) {
                this.isPillSelected = false;
                this._cdRef.detectChanges();
            }
        });
    }

    removeEmail(email: string) {
        const index = this.emails.indexOf(email, 0);

        if (index > -1) {
            this.emails.splice(index, 1);
            this._emitValidationChange();
        }
    }

    onBlur() {
        this.isPillSelected = false;
        this._addEmail();
    }

    onKeydown(event: KeyboardEvent): void {
        const index = this._submitKeys.indexOf(event.key, 0);

        if (index > -1) {
            event.preventDefault();
            this._addEmail();
            this.focus();
        }

        if (event.key === "Escape") {
            event.stopPropagation();
            this.emailInputControl.setValue('');
            (this.inputEl.nativeElement as HTMLInputElement).blur();
        }
    }

    onTab(event: KeyboardEvent) {
        /**
         * If the input has a value, add it as an entry.
         *
         * Otherwise, allow the default tab behaviour
         */
        if (this.emailInputControl.value.length > 0) {
            event.preventDefault();
            this._addEmail();
            this.focus();
        }
    }

    isValid(email: string): boolean {
        this._validationFormControl.setValue(email);
        const isBlacklisted = this.blacklist.some(item => {
            /**
             * If item in blacklist is a string, create a regular expression to match the full
             * case-insenstive string
             */
            if (typeof item === 'string') {
                return email.match(new RegExp(`^${item}$`, 'i'));
            }
            return email.match(item)
        });

        return Validators.email(this._validationFormControl) === null && !isBlacklisted;
    }

    onContainerClick(event: MouseEvent) {
        /**
         * We're only interested in this event if it originates from the container element.
         *
         * We don't care about events that bubble up from child elements.
         */
        if (event.target === this.container.nativeElement) {
            this.focus();
        }
    }

    onPaste(event: ClipboardEvent) {
        if (event.clipboardData) {
            event.preventDefault();

            this.emailInputControl.markAsDirty();

            const selectionStart: number = (this.inputEl.nativeElement as HTMLInputElement).selectionStart
            const selectionEnd: number = (this.inputEl.nativeElement as HTMLInputElement).selectionEnd;
            const controlValue: string = (this.emailInputControl.value as string);

            let pastedData: string = event.clipboardData.getData("text");

            /**
             * We need to check if the input already has a value when the user pasted
             */
            if (this.emailInputControl.value.length) {
                /**
                 * The user has selected text in the input
                 */
                if (selectionStart !== selectionEnd) {
                    const newValue: string = controlValue.slice(0, selectionStart) + controlValue.slice(selectionEnd);
                    pastedData = newValue.slice(0, selectionStart) + pastedData + newValue.slice(selectionStart);
                }
                else {
                    pastedData = controlValue.slice(0, selectionStart) + pastedData + controlValue.slice(selectionStart);
                }
            }

            const items: string[] = pastedData
                .split(/\s+/)
                .map(item => item.split(/,|;/g))
                .reduce((acc, curr) => acc.concat(curr), [])
                .filter(item => item);

            const lastEmail: string = items[items.length - 1];

            if (this.isValid(lastEmail)) {
                // Use Set to remove duplicate emails
                this.emails = Array.from(new Set(this.emails.concat(items)));
                this.emailInputControl.setValue('');
            }
            else {
                items.pop();
                // Use Set to remove duplicate emails
                this.emails = Array.from(new Set(this.emails.concat(items)));
                this.emailInputControl.setValue(lastEmail);
            }
            this._emitValidationChange();
        }
    }

    private _addEmail() {
        const email: string = this.emailInputControl.value.trim();

        // We only want to add the entry if it hasn't already been added
        if (email.length && this.emails.indexOf(email) === -1) {
            this.emails = this.emails.concat(this.emailInputControl.value.trim());
            this._emitValidationChange();
        }
        this.emailInputControl.setValue('');
    }

    private focus() {
        (this.inputEl.nativeElement as HTMLInputElement).focus();
    }

    onBackspace() {
        if (this.emailInputControl.value.length < 1 && this.emails.length > 0) {
            if (this.isPillSelected) {
                this.removeEmail(this.emails[this.emails.length - 1]);
            }
            else {
                this.isPillSelected = true;
            }
        }
    }

    private _emitValidationChange() {
        /**
         * isValid is based on the entered emails and does not include the current value of the form control
         */
        const isValid: boolean = this.emails.length > 0 && this.emails.every(email => this.isValid(email));

        this.updated.emit({
            isValid: isValid,
            emails: this.emails,
            control: this.emailInputControl
        })
    }

    ngOnDestroy() {
        this._valueChangesSub.unsubscribe();
    }
}
