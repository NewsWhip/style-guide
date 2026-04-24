import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsComponent } from './tabs.component';
import { TabDirective } from './tab.directive';

@Component({
    imports: [TabsComponent, TabDirective],
    template: `
        <nw-tabs>
            @for (tab of tabs; track tab) {
                <li
                    nwTab
                    [isActive]="tab.isActive">
                    <button (click)="activate(tab)">{{ tab.label }}</button>
                </li>
            }
        </nw-tabs>
    `
})
class TestHostComponent {
    tabs = [
        { label: 'Tab 1', isActive: true },
        { label: 'Tab 2', isActive: false },
        { label: 'Tab 3', isActive: false }
    ];

    activate(selected: { isActive: boolean }) {
        this.tabs.forEach(t => (t.isActive = t === selected));
    }
}

describe('TabsComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    const tablist = (): HTMLElement => fixture.debugElement.query(By.css('[role="tablist"]')).nativeElement;
    const tabEls = (): HTMLElement[] => fixture.debugElement.queryAll(By.css('[role="tab"]')).map(d => d.nativeElement);
    const dispatchKeydown = (key: string) => {
        tablist().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        fixture.detectChanges();
    };

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({ imports: [TestHostComponent] });
        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }));

    describe('ARIA attributes', () => {
        it('should have role="tablist" on the <ul>', () => {
            expect(tablist()).toBeTruthy();
        });

        it('should set role="tab" on each <li>', () => {
            expect(tabEls().length).toBe(3);
        });

        it('should set aria-selected="true" on the active tab', () => {
            expect(tabEls()[0].getAttribute('aria-selected')).toBe('true');
        });

        it('should set aria-selected="false" on inactive tabs', () => {
            expect(tabEls()[1].getAttribute('aria-selected')).toBe('false');
            expect(tabEls()[2].getAttribute('aria-selected')).toBe('false');
        });

        it('should update aria-selected when isActive changes', fakeAsync(() => {
            host.tabs[0].isActive = false;
            host.tabs[1].isActive = true;
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            expect(tabEls()[0].getAttribute('aria-selected')).toBe('false');
            expect(tabEls()[1].getAttribute('aria-selected')).toBe('true');
        }));
    });

    describe('roving tabindex', () => {
        it('should give the active tab tabindex="0"', () => {
            expect(tabEls()[0].getAttribute('tabindex')).toBe('0');
        });

        it('should give inactive tabs tabindex="-1"', () => {
            expect(tabEls()[1].getAttribute('tabindex')).toBe('-1');
            expect(tabEls()[2].getAttribute('tabindex')).toBe('-1');
        });

        it('should set inner button to tabindex="-1"', () => {
            const btn = tabEls()[0].querySelector('button');
            expect(btn?.getAttribute('tabindex')).toBe('-1');
        });
    });

    describe('keyboard navigation', () => {
        beforeEach(() => {
            tabEls()[0].focus();
            fixture.detectChanges();
        });

        it('should move focus right on ArrowRight', () => {
            dispatchKeydown('ArrowRight');
            expect(tabEls()[1].getAttribute('tabindex')).toBe('0');
            expect(document.activeElement).toBe(tabEls()[1]);
        });

        it('should move focus left on ArrowLeft', () => {
            tabEls()[1].focus();
            dispatchKeydown('ArrowLeft');
            expect(tabEls()[0].getAttribute('tabindex')).toBe('0');
            expect(document.activeElement).toBe(tabEls()[0]);
        });

        it('should wrap from last to first on ArrowRight', () => {
            tabEls()[2].focus();
            dispatchKeydown('ArrowRight');
            expect(document.activeElement).toBe(tabEls()[0]);
        });

        it('should wrap from first to last on ArrowLeft', () => {
            dispatchKeydown('ArrowLeft');
            expect(document.activeElement).toBe(tabEls()[2]);
        });

        it('should set all other tabs to tabindex="-1" during arrow navigation', () => {
            dispatchKeydown('ArrowRight');
            expect(tabEls()[0].getAttribute('tabindex')).toBe('-1');
            expect(tabEls()[2].getAttribute('tabindex')).toBe('-1');
        });
    });

    describe('focusout', () => {
        it('should restore tabindex when focus leaves the tablist', fakeAsync(() => {
            tabEls()[0].focus();
            dispatchKeydown('ArrowRight');
            dispatchKeydown('ArrowRight'); // tab[2] has tabindex=0, is focused

            // actually move focus outside so document.activeElement is not in the tablist
            document.body.setAttribute('tabindex', '0');
            document.body.focus();
            tablist().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
            tick();
            fixture.detectChanges();
            document.body.removeAttribute('tabindex');

            // tabindices restored from isActive: active tab (index 0) gets 0, others -1
            expect(tabEls()[0].getAttribute('tabindex')).toBe('0');
            expect(tabEls()[1].getAttribute('tabindex')).toBe('-1');
            expect(tabEls()[2].getAttribute('tabindex')).toBe('-1');
        }));
    });
});
