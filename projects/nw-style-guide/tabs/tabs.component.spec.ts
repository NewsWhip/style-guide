import { Component } from '@angular/core';
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

@Component({
    imports: [TabsComponent, TabDirective],
    template: `
        <nw-tabs>
            @for (tab of tabs; track tab) {
                <li
                    nwTab
                    [isActive]="tab.isActive">
                    <span
                        nwTabLabel
                        (click)="activate(tab)">
                        {{ tab.label }}
                    </span>
                    <button class="btn">options</button>
                </li>
            }
        </nw-tabs>
    `
})
class SpanLabelHostComponent {
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

    const tablist = (): HTMLElement => fixture.debugElement.query(By.css('ul.nav')).nativeElement;
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

    describe('nwTabLabel labels', () => {
        let labelFixture: ComponentFixture<SpanLabelHostComponent>;
        let labelHost: SpanLabelHostComponent;

        const labelTabEls = (): HTMLElement[] =>
            labelFixture.debugElement.queryAll(By.css('[role="tab"]')).map(d => d.nativeElement);

        beforeEach(fakeAsync(() => {
            labelFixture = TestBed.createComponent(SpanLabelHostComponent);
            labelHost = labelFixture.componentInstance;
            labelFixture.detectChanges();
            tick();
            labelFixture.detectChanges();
        }));

        it('should make the label the tab, with the li only presentational', () => {
            const lis = labelFixture.debugElement.queryAll(By.css('li')).map(d => d.nativeElement as HTMLElement);

            expect(labelTabEls().length).toBe(3);
            expect(labelTabEls().every(el => el.hasAttribute('nwTabLabel'))).toBeTrue();
            expect(lis.every(li => li.getAttribute('role') === 'presentation')).toBeTrue();
            expect(lis.every(li => !li.hasAttribute('tabindex'))).toBeTrue();
        });

        it('should have an empty tablist own the tabs by id, with the ul presentational', () => {
            const tablist: HTMLElement = labelFixture.debugElement.query(By.css('[role="tablist"]')).nativeElement;
            const ul: HTMLElement = labelFixture.debugElement.query(By.css('ul.nav')).nativeElement;

            expect(tablist.tagName).not.toBe('UL');
            expect(tablist.children.length).toBe(0);
            expect(ul.getAttribute('role')).toBe('presentation');
            expect(tablist.getAttribute('aria-owns')).toBe(labelTabEls().map(t => t.id).join(' '));
            expect(labelTabEls().every(t => !!t.id)).toBeTrue();
        });

        it('should keep the ul as the tablist where the tabs are not nwTabLabel elements', () => {
            expect(fixture.debugElement.query(By.css('ul.nav')).nativeElement.getAttribute('role')).toBe('tablist');
            expect(fixture.debugElement.queryAll(By.css('[role="tablist"]')).length).toBe(1);
            expect(fixture.debugElement.query(By.css('[aria-owns]'))).toBeNull();
        });

        it('should activate the nwTabLabel element on Enter', fakeAsync(() => {
            labelTabEls()[1].focus();
            labelFixture.debugElement
                .query(By.css('ul.nav'))
                .nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            labelFixture.detectChanges();
            tick();
            labelFixture.detectChanges();

            expect(labelHost.tabs[1].isActive).toBeTrue();
            expect(labelTabEls()[1].getAttribute('aria-selected')).toBe('true');
        }));

        it('should make the action button a tab stop for the active tab only', () => {
            const actionButtons = labelFixture.debugElement
                .queryAll(By.css('button.btn'))
                .map(d => d.nativeElement as HTMLElement);

            expect(actionButtons[0].getAttribute('tabindex')).toBe('0');
            expect(actionButtons[1].getAttribute('tabindex')).toBe('-1');
        });

        it('should leave Enter on the action button alone, so that it opens natively', () => {
            const btn: HTMLButtonElement = labelFixture.debugElement.query(By.css('button.btn')).nativeElement;
            btn.focus();
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

            btn.dispatchEvent(event);

            expect(event.defaultPrevented).toBeFalse();
            expect(labelHost.tabs[1].isActive).toBeFalse();
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
