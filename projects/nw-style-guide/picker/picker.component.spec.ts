import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { NwPickerComponent } from './picker.component';
import { IPickerItem } from './IPickerItem';

const mockItems: IPickerItem[] = [
    { id: 1, parentId: null, displayName: 'Option A', value: 'a', added: false },
    { id: 2, parentId: null, displayName: 'Option B', value: 'b', added: false },
    { id: 3, parentId: null, displayName: 'Option C', value: 'c', added: false }
];

let comp: NwPickerComponent;
let fixture: ComponentFixture<NwPickerComponent>;
let de: DebugElement;

describe('NwPickerComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NwPickerComponent, A11yModule],
            providers: [provideNoopAnimations()]
        });
        fixture = TestBed.createComponent(NwPickerComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        comp.items = mockItems.map(i => ({ ...i }));
        fixture.detectChanges();
    });

    const getInput = (): HTMLInputElement => de.query(By.css('.search-input')).nativeElement;

    const getOptionItems = (): HTMLElement[] =>
        de.queryAll(By.css('.picker-options-list .search-result')).map(d => d.nativeElement);

    const openDropdown = () => {
        getInput().click();
        fixture.detectChanges();
    };

    const dispatchKeydown = (element: HTMLElement, key: string) => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        fixture.detectChanges();
    };

    describe('keyboard navigation', () => {
        beforeEach(() => {
            openDropdown();
        });

        it('should apply keyboard-focused to the first item on ArrowDown from the input', () => {
            dispatchKeydown(getInput(), 'ArrowDown');
            const items = getOptionItems();
            expect(items[0].classList).toContain('keyboard-focused');
            expect(items[1].classList).not.toContain('keyboard-focused');
        });

        it('should move keyboard-focused to the next item on subsequent ArrowDown', () => {
            dispatchKeydown(getInput(), 'ArrowDown');
            dispatchKeydown(getOptionItems()[0], 'ArrowDown');
            const items = getOptionItems();
            expect(items[0].classList).not.toContain('keyboard-focused');
            expect(items[1].classList).toContain('keyboard-focused');
        });

        it('should not move focus past the last item on ArrowDown', () => {
            dispatchKeydown(getInput(), 'ArrowDown');
            // Navigate to the last item and one beyond
            for (let i = 0; i < mockItems.length; i++) {
                dispatchKeydown(getOptionItems()[Math.min(i, mockItems.length - 1)], 'ArrowDown');
            }
            const items = getOptionItems();
            expect(items[mockItems.length - 1].classList).toContain('keyboard-focused');
        });

        it('should return focus to the input on ArrowUp from the first item', () => {
            dispatchKeydown(getInput(), 'ArrowDown');
            dispatchKeydown(getOptionItems()[0], 'ArrowUp');
            expect(document.activeElement).toBe(getInput());
        });

        it('should clear keyboard-focused from all items when focus returns to the input', () => {
            dispatchKeydown(getInput(), 'ArrowDown');
            dispatchKeydown(getOptionItems()[0], 'ArrowUp');
            getOptionItems().forEach(item => expect(item.classList).not.toContain('keyboard-focused'));
        });
    });

    describe('focusout from list', () => {
        beforeEach(() => {
            openDropdown();
            dispatchKeydown(getInput(), 'ArrowDown');
        });

        it('should clear keyboard-focused when focus moves to an element outside the list', () => {
            expect(comp.focusedIndex).toBe(0);
            const list = de.query(By.css('.picker-options-list')).nativeElement;
            list.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: getInput() }));
            fixture.detectChanges();
            expect(comp.focusedIndex).toBe(-1);
            getOptionItems().forEach(item => expect(item.classList).not.toContain('keyboard-focused'));
        });

        it('should not clear keyboard-focused when focus moves to another item within the list', () => {
            const items = getOptionItems();
            const list = de.query(By.css('.picker-options-list')).nativeElement;
            list.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: items[1] }));
            fixture.detectChanges();
            expect(comp.focusedIndex).toBe(0);
        });
    });

    describe('closeResults', () => {
        beforeEach(() => {
            comp.items = mockItems.map((item, i) => ({ ...item, added: i === 0 }));
            openDropdown();
            comp.editSelections(new Event('click'));
            fixture.detectChanges();
        });

        it('should reset selectionsAreShowing when the dropdown is closed', () => {
            expect(comp.selectionsAreShowing).toBeTrue();
            comp.closeResults();
            expect(comp.selectionsAreShowing).toBeFalse();
        });

        it('should show the main options list when reopened after viewing selections', () => {
            comp.closeResults();
            fixture.detectChanges();
            openDropdown();
            expect(de.query(By.css('.picker-options-list'))).toBeTruthy();
            expect(de.query(By.css('.selected-items'))).toBeFalsy();
        });
    });

    describe('ARIA attributes', () => {
        it('should have role="combobox" on the input', () => {
            expect(getInput().getAttribute('role')).toBe('combobox');
        });

        it('should set aria-label on the input to inputPlaceholderText', () => {
            fixture.componentRef.setInput('inputPlaceholderText', 'Search topics...');
            fixture.detectChanges();
            expect(getInput().getAttribute('aria-label')).toBe('Search topics...');
        });

        it('should set aria-expanded to false when the dropdown is closed', () => {
            expect(getInput().getAttribute('aria-expanded')).toBe('false');
        });

        it('should set aria-expanded to true when the dropdown is open', () => {
            openDropdown();
            expect(getInput().getAttribute('aria-expanded')).toBe('true');
        });

        it('should set aria-activedescendant to null when no item is focused', () => {
            openDropdown();
            expect(getInput().getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should set aria-activedescendant to the focused item id on ArrowDown', () => {
            openDropdown();
            dispatchKeydown(getInput(), 'ArrowDown');
            const expectedId = `${comp.pickerId}-option-${mockItems[0].id}`;
            expect(getInput().getAttribute('aria-activedescendant')).toBe(expectedId);
        });

        it('should update aria-activedescendant as focus moves through the list', () => {
            openDropdown();
            dispatchKeydown(getInput(), 'ArrowDown');
            dispatchKeydown(getOptionItems()[0], 'ArrowDown');
            const expectedId = `${comp.pickerId}-option-${mockItems[1].id}`;
            expect(getInput().getAttribute('aria-activedescendant')).toBe(expectedId);
        });

        it('should clear aria-activedescendant when focus returns to the input', () => {
            openDropdown();
            dispatchKeydown(getInput(), 'ArrowDown');
            dispatchKeydown(getOptionItems()[0], 'ArrowUp');
            expect(getInput().getAttribute('aria-activedescendant')).toBeNull();
        });

        describe('options list', () => {
            beforeEach(() => {
                openDropdown();
            });

            it('should have role="listbox" on the options list', () => {
                const list = de.query(By.css('.picker-options-list')).nativeElement;
                expect(list.getAttribute('role')).toBe('listbox');
            });

            it('should label the options list as "Options" when there is no search term', () => {
                const list = de.query(By.css('.picker-options-list')).nativeElement;
                expect(list.getAttribute('aria-label')).toBe('Options');
            });

            it('should label the options list as "Search results" when a search term is present', () => {
                const inputEl = getInput();
                inputEl.value = 'Option';
                inputEl.dispatchEvent(new Event('input'));
                fixture.detectChanges();
                const list = de.query(By.css('.picker-options-list')).nativeElement;
                expect(list.getAttribute('aria-label')).toBe('Search results');
            });

            it('should set aria-selected to false on unselected items', () => {
                const [firstItem] = getOptionItems();
                expect(firstItem.getAttribute('aria-selected')).toBe('false');
            });

            it('should set aria-selected to true on selected items', () => {
                comp.items = mockItems.map((item, i) => ({ ...item, added: i === 0 }));
                openDropdown();
                const [firstItem] = getOptionItems();
                expect(firstItem.getAttribute('aria-selected')).toBe('true');
            });

            it('should set aria-label to the item displayName for a basic item', () => {
                const [firstItem] = getOptionItems();
                expect(firstItem.getAttribute('aria-label')).toBe('Option A');
            });

            it('should append ", selected" to aria-label when item is added', () => {
                comp.items = mockItems.map((item, i) => ({ ...item, added: i === 0 }));
                openDropdown();
                const [firstItem] = getOptionItems();
                expect(firstItem.getAttribute('aria-label')).toBe('Option A, selected');
            });

            it('should append ", excluded" to aria-label when item is excluded', () => {
                comp.items = mockItems.map((item, i) => ({ ...item, excluded: i === 0 }));
                openDropdown();
                const [firstItem] = getOptionItems();
                expect(firstItem.getAttribute('aria-label')).toBe('Option A, excluded');
            });

            it('should append ", has sub-items" to aria-label when item has children', () => {
                comp.items = [
                    { id: 10, parentId: null, displayName: 'Parent', value: 'parent', added: false },
                    { id: 11, parentId: 10, displayName: 'Child', value: 'child', added: false }
                ];
                openDropdown();
                const [parentItem] = getOptionItems();
                expect(parentItem.getAttribute('aria-label')).toBe('Parent, has sub-items');
            });
        });

        describe('selections list', () => {
            beforeEach(() => {
                comp.items = mockItems.map((item, i) => ({ ...item, added: i === 0 }));
                openDropdown();
                comp.editSelections(new Event('click'));
                fixture.detectChanges();
            });

            it('should have role="listbox" on the selections list', () => {
                const list = de.query(By.css('.selected-items')).nativeElement;
                expect(list.getAttribute('role')).toBe('listbox');
            });

            it('should label the selections list as "Current selections"', () => {
                const list = de.query(By.css('.selected-items')).nativeElement;
                expect(list.getAttribute('aria-label')).toBe('Current selections');
            });
        });
    });

    describe('drilldown button', () => {
        it('should not toggle item inclusion when Enter is pressed on the drilldown button', () => {
            comp.items = [
                { id: 10, parentId: null, displayName: 'Parent', value: 'parent', added: false },
                { id: 11, parentId: 10, displayName: 'Child', value: 'child', added: false }
            ];
            fixture.detectChanges();
            openDropdown();

            const spy = spyOn(comp, 'toggleItemInclusion');
            const drilldownBtn = de.query(By.css('.drilldown')).nativeElement;
            drilldownBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            fixture.detectChanges();

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
