import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { EmailInputComponent } from "./email-input.component";

let comp: EmailInputComponent;
let fixture: ComponentFixture<EmailInputComponent>;
let de: DebugElement;

describe('EmailInputComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            declarations: [
                EmailInputComponent
            ]
        });
        fixture = TestBed.createComponent(EmailInputComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        comp.emails = ['a@a.com', 'b@b.com'];
    });

    const getInput = () => de.query(By.css('input')).nativeElement;

    it('should show emails as pills', () => {
        fixture.detectChanges();
        const els = de.queryAll(By.css('.emails-container > .pill'));
        expect(els.length).toEqual(2);
    });

    it('should focus the input on container click', () => {
        fixture.detectChanges();
        const containerEl = de.query(By.css('.emails-container'));
        const inputEl = getInput();
        expect(document.activeElement).not.toBe(inputEl);
        containerEl.nativeElement.click();
        expect(document.activeElement).toBe(inputEl);
    });

    it('clicking the "x" should remove the email', () => {
        fixture.detectChanges();
        expect(comp.emails.length).toEqual(2);
        const [close] = de.queryAll(By.css('.emails-container > .pill > .close'));
        close.nativeElement.click();
        expect(comp.emails.length).toEqual(1);
    });

    it('isValid should be emitted as true when all entered emails are valid', () => {
        const spy = spyOn(comp.updated, 'emit');
        fixture.detectChanges();

        const [event] = spy.calls.mostRecent().args;
        expect(event.isValid).toEqual(true);
    });

    it('isValid should be emitted as false when any entered email is invalid', () => {
        comp.emails = ['a@a.com', 'b@b.com', 'invalid.email'];
        const spy = spyOn(comp.updated, 'emit');
        fixture.detectChanges();

        const [event] = spy.calls.mostRecent().args;
        expect(event.isValid).toEqual(false);
    });

    it('should not emit a validation event when the form control changes', () => {
        fixture.detectChanges();

        const spy = spyOn(comp.updated, 'emit');
        comp.emailInputControl.setValue('invalid.email');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not include the form control when assessing the validity', () => {
        fixture.detectChanges();

        const spy = spyOn(comp.updated, 'emit');
        comp.emailInputControl.setValue('invalid.email');
        comp['_emitValidationChange']();
        const [event] = spy.calls.mostRecent().args;
        expect(comp.emailInputControl.invalid).toEqual(true);
        expect(event.isValid).toEqual(true);
    });

    describe('should show a pill as invalid if', () => {
        it('it is not in an email format', () => {
            comp.emails = ['a@a.com', 'dsadsadsa'];
            fixture.detectChanges();
            const [validPill, invalidPill] = de.queryAll(By.css('.emails-container > .pill'));
            expect(validPill.nativeElement.classList).not.toContain('invalid');
            expect(invalidPill.nativeElement.classList).toContain('invalid');
        });

        it('if it matches a string in the blacklist', () => {
            comp.blacklist = ['b@b.com'];
            fixture.detectChanges();
            const [validPill, invalidPill] = de.queryAll(By.css('.emails-container > .pill'));
            expect(validPill.nativeElement.classList).not.toContain('invalid');
            expect(invalidPill.nativeElement.classList).toContain('invalid');
        });

        it('if it matches a regex in the blacklist', () => {
            comp.emails = ['a@a.com', 'b@b.com', 'c@c.com'];
            comp.blacklist = [new RegExp('C@c.CoM', 'i')];
            fixture.detectChanges();
            const [validPill, _, invalidPill] = de.queryAll(By.css('.emails-container > .pill'));
            expect(validPill.nativeElement.classList).not.toContain('invalid');
            expect(invalidPill.nativeElement.classList).toContain('invalid');
        });
    });

    describe('keyboard events', () => {
        beforeEach(() => {
            fixture.detectChanges();
            comp.emailInputControl.setValue('c@c.com');
        });

        it('should add an email on tab', () => {
            const input = getInput();
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: 'Tab'
            }));
            expect(comp.emails.length).toEqual(3);
        });

        it('should add an email on space', () => {
            const input = getInput();
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: " "
            }));
            expect(comp.emails.length).toEqual(3);
        });

        it('should add an email on comma', () => {
            const input = getInput();
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: ","
            }));
            expect(comp.emails.length).toEqual(3);
        });

        it('should add an email on semi-colon', () => {
            const input = getInput();
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: ";"
            }));
            expect(comp.emails.length).toEqual(3);
        });

        it('should clear the input on Escape', () => {
            const input = getInput();
            input.dispatchEvent(new KeyboardEvent("keydown", {
                key: "Escape"
            }));
            expect(comp.emails.length).toEqual(2);
            expect(comp.emailInputControl.value).toEqual('');
        });
    });
});