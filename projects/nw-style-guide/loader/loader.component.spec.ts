import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from './loader.component';

/**
 * Mirrors the default `delayMs`, which the announcement waits out
 */
const DELAY_MS = 700;

describe('LoaderComponent', () => {
    let fixture: ComponentFixture<LoaderComponent>;

    const hostEl = (): HTMLElement => fixture.nativeElement;
    const loaderEl = (): HTMLElement => fixture.debugElement.query(By.css('.loader'))?.nativeElement;
    const announcement = (): HTMLElement => fixture.debugElement.query(By.css('.sr-only'))?.nativeElement;

    const setInput = (name: string, value: unknown): void => {
        fixture.componentRef.setInput(name, value);
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [LoaderComponent] });
        fixture = TestBed.createComponent(LoaderComponent);
        fixture.detectChanges();
    });

    describe('live region', () => {
        it('exists before anything is loading, so the text is announced as a change to it', () => {
            expect(hostEl().getAttribute('role')).toBe('status');
            expect(loaderEl()).toBeUndefined();
        });

        it('stays in place once loading finishes', fakeAsync(() => {
            setInput('isLoading', true);
            tick(DELAY_MS);
            setInput('isLoading', false);

            expect(hostEl().getAttribute('role')).toBe('status');
        }));
    });

    describe('announcement', () => {
        it('is not made before the loader is seen', fakeAsync(() => {
            setInput('isLoading', true);

            expect(announcement()).toBeUndefined();

            tick(DELAY_MS - 1);
            fixture.detectChanges();

            expect(announcement()).toBeUndefined();

            tick(1);
        }));

        it('is made once the delay has passed', fakeAsync(() => {
            setInput('isLoading', true);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement().textContent.trim()).toBe('Loading');
        }));

        it('uses a custom message', fakeAsync(() => {
            setInput('loadingMessage', 'Loading results');
            setInput('isLoading', true);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement().textContent.trim()).toBe('Loading results');
        }));

        it('is opted out of by an empty message, for a region the consumer announces itself', fakeAsync(() => {
            setInput('loadingMessage', '');
            setInput('isLoading', true);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement()).toBeUndefined();
        }));

        it('waits out a custom delay', fakeAsync(() => {
            setInput('delayMs', 2000);
            setInput('isLoading', true);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement()).toBeUndefined();

            tick(2000 - DELAY_MS);
            fixture.detectChanges();

            expect(announcement().textContent.trim()).toBe('Loading');
        }));

        it('is never made for a load that finishes before the delay', fakeAsync(() => {
            setInput('isLoading', true);
            tick(DELAY_MS - 100);
            setInput('isLoading', false);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement()).toBeUndefined();
        }));

        it('is removed when loading finishes', fakeAsync(() => {
            setInput('isLoading', true);
            tick(DELAY_MS);
            setInput('isLoading', false);

            expect(announcement()).toBeUndefined();
        }));

        it('is made again on a second load', fakeAsync(() => {
            setInput('isLoading', true);
            tick(DELAY_MS);
            setInput('isLoading', false);
            setInput('isLoading', true);
            tick(DELAY_MS);
            fixture.detectChanges();

            expect(announcement().textContent.trim()).toBe('Loading');
        }));

        it('does not fire after the component is destroyed', fakeAsync(() => {
            setInput('isLoading', true);
            fixture.destroy();

            expect(() => tick(DELAY_MS)).not.toThrow();
        }));
    });

    describe('dots', () => {
        it('are hidden from assistive technology, as they carry no information', fakeAsync(() => {
            setInput('isLoading', true);

            expect(loaderEl().getAttribute('aria-hidden')).toBe('true');

            tick(DELAY_MS);
        }));

        it('renders the requested number', fakeAsync(() => {
            setInput('numOfDots', 3);
            setInput('isLoading', true);

            expect(fixture.debugElement.queryAll(By.css('.dot')).length).toBe(3);

            tick(DELAY_MS);
        }));
    });
});
