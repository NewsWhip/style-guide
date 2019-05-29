import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { IValidationChange } from "./models/IValidationChange";

@Component({
    selector: 'nw-email-input',
    templateUrl: './email-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'nw-email-input'
})
export class EmailInputComponent implements OnInit, OnDestroy {

    @Input() emails: string[] = [];
    @Input() placeholder: string = '';

    @Output() validationChange: EventEmitter<IValidationChange> = new EventEmitter();

    @ViewChild('inputEl') inputEl: ElementRef;
    @ViewChild('container') container: ElementRef;

    public emailInputControl: FormControl = new FormControl("", Validators.email);
    public shouldDisplayInput: boolean = false;
    public isPillSelected: boolean = false;

    private _validationFormControl: FormControl = new FormControl();
    private _submitKeys: string[] = [",", "Enter", "Tab", " ", ";"];
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
            this._emitValidationChange();
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
        this.shouldDisplayInput = false;
        this.isPillSelected = false;
        this._addEmail();
    }

    onKeydown(event: KeyboardEvent): void {
        const index = this._submitKeys.indexOf(event.key, 0);

        if (index > -1) {
            event.preventDefault();
            this._addEmail();
            this._focus();
        }

        if (event.key === "Escape") {
            this._clearControlAndMarkAsPristine();
            (this.inputEl.nativeElement as HTMLInputElement).blur();
        }
    }

    isValid(email: string): boolean {
        this._validationFormControl.setValue(email);

        return Validators.email(this._validationFormControl) === null;
    }

    onContainerClick(event: MouseEvent) {
        /**
         * We're only interested in this event if it originates from the container element.
         *
         * We don't care about events that bubble up from child elements.
         */
        if (event.srcElement === this.container.nativeElement) {
            this.shouldDisplayInput = true;
            this._focus();
        }
    }

    onPaste(event: ClipboardEvent) {
        if (event.clipboardData) {
            event.preventDefault();

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
                // Uset Set to remove duplicate emails
                this.emails = Array.from(new Set(this.emails.concat(items)));
                this._clearControlAndMarkAsPristine();
            }
            else {
                items.pop();
                // Uset Set to remove duplicate emails
                this.emails = Array.from(new Set(this.emails.concat(items)));
                this.emailInputControl.markAsDirty();
                this.emailInputControl.setValue(lastEmail);
            }
        }
    }

    private _addEmail() {
        const email: string = this.emailInputControl.value.trim();

        // We only want to add the entry if it hasn't already been added
        if (email.length && this.emails.indexOf(email) === -1) {
            this.emails = this.emails.concat(this.emailInputControl.value.trim());
        }
        this._clearControlAndMarkAsPristine();
    }

    private _focus() {
        setTimeout(() => {
            (this.inputEl.nativeElement as HTMLInputElement).focus();
        }, 0);
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
        const isValid: boolean = this.emails.every(email => this.isValid(email));

        this.validationChange.emit({
            isValid: isValid,
            emails: this.emails,
            control: this.emailInputControl
        })
    }

    private _clearControlAndMarkAsPristine(): void {
        // Mark as pristine before setting the value. If we mark as pristine after setting the
        // value, `setValue` will trigger the EventEmitter before we have marked the control
        // as pristine.
        this.emailInputControl.markAsPristine();
        this.emailInputControl.setValue('');
    }

    ngOnDestroy() {
        this._valueChangesSub.unsubscribe();
    }
}
