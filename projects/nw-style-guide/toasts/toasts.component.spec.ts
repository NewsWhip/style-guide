import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastsComponent } from './toasts.component';

/**
 * Mirrors the constants in `toast-announcer.ts`
 */
const ANNOUNCE_DELAY = 100;
const DIALOG_WAIT_TIMEOUT = 500;
const PADDING = ' ';

/**
 * A stand-in for a CDK dialog, which is opened with `aria-modal="true"` and so hides the
 * body-level live regions from screen readers while it is present.
 */
const addOpenDialog = (): HTMLElement => {
    const dialog = document.createElement('div');

    dialog.setAttribute('aria-modal', 'true');
    document.body.appendChild(dialog);

    return dialog;
};

const politeRegions = (): HTMLElement[] => Array.from(document.querySelectorAll('body > div[role="status"]'));
const assertiveRegions = (): HTMLElement[] => Array.from(document.querySelectorAll('body > div[role="alert"]'));
const politeRegion = (): HTMLElement => politeRegions()[0];
const assertiveRegion = (): HTMLElement => assertiveRegions()[0];

describe('ToastsComponent', () => {
    let fixture: ComponentFixture<ToastsComponent>;
    let component: ToastsComponent;
    let dialog: HTMLElement;

    const toastEl = (): HTMLElement => fixture.debugElement.query(By.css('.toast'))?.nativeElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ToastsComponent] });
        fixture = TestBed.createComponent(ToastsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        dialog?.remove();
        dialog = null;
    });

    describe('live regions', () => {
        it('creates no regions until a toast is shown', () => {
            expect(politeRegions().length).toBe(0);
            expect(assertiveRegions().length).toBe(0);
        });

        it('builds only the region the toast needs', fakeAsync(() => {
            component.success('Your search has been saved');
            tick(ANNOUNCE_DELAY);

            expect(politeRegions().length).toBe(1);
            expect(assertiveRegions().length).toBe(0);
        }));

        it('reuses the region for later toasts of the same type', fakeAsync(() => {
            component.success('Your search has been saved');
            tick(ANNOUNCE_DELAY);

            component.success('Your group has been renamed');
            tick(ANNOUNCE_DELAY);

            expect(politeRegions().length).toBe(1);
        }));

        it('announces a success politely, prefixed with the type', fakeAsync(() => {
            component.success('Your search has been saved');

            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Success: Your search has been saved');
        }));

        it('announces an error assertively, prefixed with the type', fakeAsync(() => {
            component.error('Something went wrong');

            tick(ANNOUNCE_DELAY);

            expect(assertiveRegion().textContent).toBe('Error: Something went wrong');
            expect(politeRegions().length).toBe(0);
        }));

        it('writes the message after a delay, so the change registers as a change', fakeAsync(() => {
            component.success('All is well');

            expect(politeRegion().textContent).toBe('');

            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Success: All is well');
        }));

        it('re-announces an identical consecutive message', fakeAsync(() => {
            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            const first = politeRegion().textContent;

            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            // Padded, because a reader drops an update matching what it has just announced. The
            // write has to differ from what is already there or it is not a mutation at all
            expect(politeRegion().textContent).toBe(`Success: Saved${PADDING}`);
            expect(politeRegion().textContent).not.toBe(first);
        }));

        it('alternates the padding so every repeat differs from the one before it', fakeAsync(() => {
            const announced: string[] = [];

            for (let i = 0; i < 4; i++) {
                component.success('Saved');
                tick(ANNOUNCE_DELAY);
                announced.push(politeRegion().textContent);
            }

            expect(announced).toEqual([
                'Success: Saved',
                `Success: Saved${PADDING}`,
                'Success: Saved',
                `Success: Saved${PADDING}`
            ]);
        }));

        it('pads with whitespace only, leaving the spoken message unchanged', fakeAsync(() => {
            component.success('Saved');
            tick(ANNOUNCE_DELAY);
            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent.trim()).toBe('Success: Saved');
        }));

        it('does not pad a message that differs from the one before it', fakeAsync(() => {
            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            component.success('Renamed');
            tick(ANNOUNCE_DELAY);

            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Success: Saved');
        }));

        it('does not pad an error following a success with the same wording, the prefix differing', fakeAsync(() => {
            component.success('Saved');
            tick(ANNOUNCE_DELAY);

            component.error('Saved');
            tick(ANNOUNCE_DELAY);

            expect(assertiveRegion().textContent).toBe('Error: Saved');
        }));

        it('states aria-live and aria-atomic rather than relying on the role to imply them', fakeAsync(() => {
            component.success('Saved');
            component.error('Failed');
            tick(ANNOUNCE_DELAY);

            // Support for the implicit `aria-atomic` of `status`/`alert` is patchy, and without it
            // a reader may report only the changed node — dropping every message after the first
            expect(politeRegion().getAttribute('aria-live')).toBe('polite');
            expect(politeRegion().getAttribute('aria-atomic')).toBe('true');
            expect(assertiveRegion().getAttribute('aria-live')).toBe('assertive');
            expect(assertiveRegion().getAttribute('aria-atomic')).toBe('true');
        }));

        it('announces a second, different message', fakeAsync(() => {
            component.success('Your search has been saved');
            tick(ANNOUNCE_DELAY);

            component.success('Your group has been renamed');
            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Success: Your group has been renamed');
        }));

        it('announces the text of an HTML message, without the markup', fakeAsync(() => {
            component.error('Could not reach <strong>Twitter</strong>');

            tick(ANNOUNCE_DELAY);

            expect(assertiveRegion().textContent).toBe('Error: Could not reach Twitter');
        }));

        it('does not announce a toast with no message text', fakeAsync(() => {
            component.show({ message: '', typeId: 'success' });

            tick(ANNOUNCE_DELAY);

            // Not even a region: there was nothing to announce
            expect(politeRegions().length).toBe(0);
        }));

        it('announces an unrecognised type politely and without a prefix', fakeAsync(() => {
            component.show({ message: 'Undo delete', typeId: 'info' });

            tick(ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Undo delete');
        }));
    });

    describe('with an open aria-modal dialog', () => {
        it('holds the announcement back until the dialog closes', fakeAsync(() => {
            dialog = addOpenDialog();

            component.success('Your group has been deleted');
            tick(DIALOG_WAIT_TIMEOUT - 1);

            // Nothing announced yet: a body-level region is hidden while the dialog is open
            expect(politeRegions().length).toBe(0);

            dialog.remove();
            tick(1 + ANNOUNCE_DELAY);

            expect(politeRegion().textContent).toBe('Success: Your group has been deleted');
        }));

        it('announces inside a dialog that stays open', fakeAsync(() => {
            dialog = addOpenDialog();

            component.error('Sorry, something went wrong saving the alert');
            tick(DIALOG_WAIT_TIMEOUT + ANNOUNCE_DELAY);

            const dialogRegion = dialog.querySelector('div[role="alert"]');

            expect(dialogRegion).toBeTruthy();
            expect(dialogRegion.textContent).toBe('Error: Sorry, something went wrong saving the alert');
            // Nothing at body level, where it would not have been heard
            expect(assertiveRegions().length).toBe(0);
        }));

        it('announces a success inside a dialog assertively, where a polite region is not heard', fakeAsync(() => {
            dialog = addOpenDialog();

            component.success('Your changes have been saved');
            tick(DIALOG_WAIT_TIMEOUT + ANNOUNCE_DELAY);

            const dialogRegion = dialog.querySelector('div[role="alert"]');

            expect(dialogRegion.textContent).toBe('Success: Your changes have been saved');
            expect(dialog.querySelector('div[role="status"]')).toBeNull();
        }));

        it('announces inside the topmost of two stacked dialogs', fakeAsync(() => {
            dialog = addOpenDialog();
            const topmost = addOpenDialog();

            component.error('Nope');
            tick(DIALOG_WAIT_TIMEOUT + ANNOUNCE_DELAY);

            expect(dialog.querySelector('div[role="alert"]')).toBeNull();
            expect(topmost.querySelector('div[role="alert"]').textContent).toBe('Error: Nope');

            topmost.remove();
        }));
    });

    describe('toast markup', () => {
        it('conveys the type in text as well as by icon', fakeAsync(() => {
            component.success('Saved');

            const prefix = toastEl().querySelector('.sr-only');

            expect(prefix.textContent.trim()).toBe('Success:');
            tick(ANNOUNCE_DELAY);
        }));

        it('hides the decorative type icon from screen readers', fakeAsync(() => {
            component.error('Broken');

            expect(toastEl().querySelector('.toast-icon').getAttribute('aria-hidden')).toBe('true');
            tick(ANNOUNCE_DELAY);
        }));

        it('labels the dismiss button and hides its icon', fakeAsync(() => {
            component.error('Broken');

            const dismissButton = toastEl().querySelector('.close-button');

            expect(dismissButton.getAttribute('aria-label')).toBe('Dismiss notification');
            expect(dismissButton.querySelector('i').getAttribute('aria-hidden')).toBe('true');
            tick(ANNOUNCE_DELAY);
        }));

        it('does not put a live region role on the toast itself', fakeAsync(() => {
            // The toast outlet is created lazily, so a role here would not reliably announce
            component.success('Saved');

            expect(toastEl().getAttribute('role')).toBeNull();
            tick(ANNOUNCE_DELAY);
        }));
    });

    describe('focus', () => {
        let trigger: HTMLButtonElement;

        beforeEach(() => {
            trigger = document.createElement('button');
            document.body.appendChild(trigger);
            trigger.focus();
        });

        afterEach(() => trigger.remove());

        it('hands focus back to the trigger when a focused toast is dismissed', fakeAsync(() => {
            const toast = component.error('Broken');
            const dismissButton = toastEl().querySelector('button') as HTMLButtonElement;

            dismissButton.focus();
            expect(document.activeElement).toBe(dismissButton);

            component.dismiss(toast);

            expect(document.activeElement).toBe(trigger);
            tick(ANNOUNCE_DELAY);
        }));

        it('hands focus back when a focused toast auto-dismisses', fakeAsync(() => {
            component.show({ message: 'Broken', typeId: 'error', isDismissable: true, dismissTimeout: 1000 });
            (toastEl().querySelector('button') as HTMLButtonElement).focus();

            tick(1000);

            expect(document.activeElement).toBe(trigger);
        }));

        it('leaves focus alone when the user is not inside the toast', fakeAsync(() => {
            const toast = component.error('Broken');
            const elsewhere = document.createElement('button');

            document.body.appendChild(elsewhere);
            elsewhere.focus();

            component.dismiss(toast);

            expect(document.activeElement).toBe(elsewhere);
            elsewhere.remove();
            tick(ANNOUNCE_DELAY);
        }));

        it('does not throw when the trigger has been removed from the document', fakeAsync(() => {
            const toast = component.error('Broken');

            (toastEl().querySelector('button') as HTMLButtonElement).focus();
            trigger.remove();

            expect(() => component.dismiss(toast)).not.toThrow();
            tick(ANNOUNCE_DELAY);
        }));
    });
});