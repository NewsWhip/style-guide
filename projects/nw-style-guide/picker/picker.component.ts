import {
    Component,
    Input,
    Output,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    EventEmitter,
    ViewChild,
    ViewChildren,
    ElementRef,
    QueryList,
    OnInit,
    OnDestroy,
    OnChanges,
    inject
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPickerItem } from './IPickerItem';
import { Subscription } from 'rxjs';
import { isUndefined } from 'lodash-es';
import { NgClass } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
    selector: 'nw-angular-picker',
    templateUrl: './picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, NgClass]
})
export class NwPickerComponent implements OnInit, OnChanges, OnDestroy {
    private _cdRef = inject(ChangeDetectorRef);
    private _elementRef = inject(ElementRef);
    private _liveAnnouncer = inject(LiveAnnouncer);

    // static counter to generate unique ids for multiple instances of the component on the same page
    private static _idCounter = 0;
    public readonly pickerId = `nw-picker-${++NwPickerComponent._idCounter}`;

    @Input() items: IPickerItem[] = [];
    @Input() inputClasses: string = '';
    @Input() placeholderText: string = 'Search...';
    @Input() inputPlaceholderText: string = 'Search...';
    @Input() noSelectionsPlaceholderText: string = 'Search...';
    @Input() initialParentId: any = null;
    @Input() shouldShowSelections: boolean = true;
    @Input() canExclude: boolean = true;
    @Input() isHeightDynamic: boolean;
    @Input() isMultiSelect: boolean = true;
    @Input() isMobileDisplay: boolean = false;
    @Input() isDisabled: boolean = false;
    @Input() isChevronHidden: boolean = false;

    @Output() selections: EventEmitter<IPickerItem[]> = new EventEmitter<IPickerItem[]>();
    @Output() toggleInclude: EventEmitter<{ item: IPickerItem; searchTerm: string }> = new EventEmitter<{
        item: IPickerItem;
        searchTerm: string;
    }>();
    @Output() toggleExclude: EventEmitter<{ item: IPickerItem; searchTerm: string }> = new EventEmitter<{
        item: IPickerItem;
        searchTerm: string;
    }>();
    @Output() edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() closed: EventEmitter<any> = new EventEmitter<any>();
    @Output() focus: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
    @Output() blur: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
    @Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
    @Output() clearSingle: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
    @Output() clearSearch: EventEmitter<any> = new EventEmitter<any>();
    @Output() desc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
    @Output() asc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();

    @ViewChild('inputEl', { static: true }) inputEl: ElementRef;
    @ViewChildren('selectionsListItems') selectionsListItems: QueryList<ElementRef>;
    @ViewChildren('optionsListItems') optionsListItems: QueryList<ElementRef>;

    public displayItems: IPickerItem[] = [];
    public searchTerm: FormControl<string> = new FormControl();
    public canViewResults: boolean = false;
    public parentId: any;
    public selectionsAreShowing: boolean = false;
    public maxHeight: number = 400;
    public focusedIndex: number = -1;
    private _subs: Subscription[] = [];

    get focusedItemId(): string | null {
        if (this.focusedIndex >= 0 && this.displayItems?.[this.focusedIndex]) {
            return `${this.pickerId}-option-${this.displayItems[this.focusedIndex].id}`;
        }
        return null;
    }

    ngOnInit() {
        this.parentId = this.initialParentId;
        this._subscribeToSearchTermChanges();
    }

    ngOnChanges() {
        if (this.isDisabled) {
            this.searchTerm.disable();
        }
    }

    ascend(event: Event, item: IPickerItem) {
        event.stopPropagation();
        this._setDisplayItemsFromParentId(item.parentId);
        this.asc.emit(item);
        this._cdRef.detectChanges();
        this._focusListItem(0);
    }

    displaySelectedItems() {
        this.displayItems = this.getSelections();
    }

    getSelections() {
        return this.items.filter(ci => ci.added || ci.excluded);
    }

    getParentItem(parentId: number | string) {
        return this.items.find(i => i.id === parentId);
    }

    hasChildren(id: number | string) {
        return this.items.filter(i => i.parentId === id).length;
    }

    editSelections(event: Event) {
        event.stopPropagation();
        this._focusInput();
        this.selectionsAreShowing = true;
        this.edit.emit(event);
    }

    onBackClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._focusInput();
        this.selectionsAreShowing = false;
        this._setDisplayItemsFromParentId(null);
    }

    onOptionItemKeydown(e: KeyboardEvent, item: IPickerItem, index: number) {
        switch (e.key) {
            case 'ArrowDown':
                this.focusNextItem(e);
                break;
            case 'ArrowUp':
                this._focusPrevItem(e);
                break;
            case 'ArrowLeft':
                this._onArrowLeft(e);
                break;
            case 'ArrowRight':
                this.onDrilldown(item);
                break;
            case 'Enter':
                this.toggleItemInclusion(item, e);
                break;
            case 'Escape':
                this._onListItemEscape(e, index);
                break;
        }
    }

    onSelectionItemKeydown(e: KeyboardEvent, item: IPickerItem) {
        switch (e.key) {
            case 'ArrowDown':
                this.focusNextItem(e);
                break;
            case 'ArrowUp':
                this._focusPrevItem(e);
                break;
            case 'Enter':
                this.clearSelection(e, item);
                break;
            case 'Escape':
                this.onBackClick(e);
                break;
        }
    }

    clearSelection(event: Event, item: IPickerItem) {
        event.preventDefault();
        event.stopPropagation();
        this._focusInput();
        item.added = false;
        item.excluded = false;

        this.clearSingle.emit(item);

        if (this.getSelections().length < 1) {
            this._setDisplayItemsFromParentId(null);
            this.selectionsAreShowing = false;
        }

        this.selections.emit(this.getSelections());
    }

    clearSelections(e?: Event) {
        if (e) {
            e.stopPropagation();
        }

        this.items = this.items.map(ci => {
            ci.added = false;
            ci.excluded = false;

            return ci;
        });

        this.clearAll.emit();

        this._setDisplayItemsFromParentId(null);
        this.selectionsAreShowing = false;

        this.selections.emit(this.getSelections());
        this._announce('All selections cleared');
    }

    toggleItemInclusion(item: IPickerItem, event: Event) {
        event.stopPropagation();

        // we're assuming that if the component is not multiSelect, then only
        // one item can be selected at any time
        if (!this.isMultiSelect) {
            this.items.forEach(item => {
                item.added = false;
                item.excluded = false;
            });
        }
        item.added = this.isMultiSelect ? !item.added : true;
        item.excluded = false;

        // setting flag for duplicate id's as in case of location for selection and deselection on checkbox click
        if (this.isMultiSelect) {
            this.items.forEach(pickerItem => {
                if (item.id === pickerItem.id) {
                    pickerItem.added = item.added;
                }
            });
        }

        this._toggleAncestors(item, false, false);
        this._toggleDescendants(item, false);

        this.toggleInclude.emit({
            item: item,
            searchTerm: this.searchTerm.value
        });
        this.selections.emit(this.getSelections());
        this._announce(`${item.displayName} ${item.added ? 'selected' : 'deselected'}`);

        if (!this.isMultiSelect) {
            this.closeResults();
        }
    }

    toggleItemExclusion(item: IPickerItem, event: Event) {
        event.stopPropagation();

        item.added = false;
        item.excluded = !item.excluded;
        // setting flag for duplicate id's as in case of location for selection and deselection on checkbox click
        if (this.isMultiSelect) {
            this.items.forEach(pickerItem => {
                if (item.id === pickerItem.id) {
                    pickerItem.excluded = item.excluded;
                }
            });
        }

        this._toggleDescendants(item, false, false);
        this._toggleAncestors(item, undefined, false);

        this.toggleExclude.emit({
            item: item,
            searchTerm: this.searchTerm.value
        });
        this.selections.emit(this.getSelections());
        this._announce(`${item.displayName} ${item.excluded ? 'excluded' : 'exclusion removed'}`);

        if (!this.isMultiSelect) {
            this.closeResults();
        }
    }

    // Returns 0 for the focused row, or the first row when nothing is focused (roving tabindex)
    getTabIndex(i: number): number {
        return this.focusedIndex === i || (this.focusedIndex === -1 && i === 0) ? 0 : -1;
    }

    // Returns 0 only when this row is focused (for child elements like checkboxes and buttons)
    getChildTabIndex(i: number): number {
        return this.focusedIndex === i ? 0 : -1;
    }

    getAriaLabel(item: IPickerItem) {
        let label = item.displayName;
        if (item.added) label += ', selected';
        if (item.excluded) label += ', excluded';
        if (this.hasChildren(item.id)) label += ', has sub-items';
        return label;
    }

    focusNextItem(event: Event) {
        event.preventDefault();
        if (!this.canViewResults) {
            this._openResultsAndFocusFirstItem();
            return;
        }
        const listLength = this.selectionsAreShowing ? this.getSelections().length : this.displayItems.length;
        if (listLength) {
            this._focusListItem(Math.min(this.focusedIndex + 1, listLength - 1));
            this._cdRef.markForCheck();
        }
    }

    onInputEnter() {
        if (!this.canViewResults) {
            this._openResultsAndFocusFirstItem();
            return;
        }
    }

    onListFocusOut(event: FocusEvent) {
        const list = event.currentTarget as HTMLElement;
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!list.contains(relatedTarget)) {
            this.focusedIndex = -1;
            this._cdRef.markForCheck();
        }
    }

    onContainerFocusOut() {
        setTimeout(() => {
            if (!this._elementRef.nativeElement.contains(document.activeElement)) {
                this.closeResults({ refocusInput: false });
                this.blur.emit(this.inputEl);
            }
        });
    }

    onFocus() {
        if (!this.isDisabled) {
            this.focus.emit(this.inputEl);
        }
    }

    showResults() {
        if (!this.isDisabled) {
            this.parentId = this.initialParentId;
            this.canViewResults = true;
            this._setDisplayItemsFromParentId(this.parentId);
        }
    }

    close() {
        this.inputEl.nativeElement.blur();
    }

    closeResults({ refocusInput = true } = {}) {
        if (!this.canViewResults) {
            return;
        }
        this.canViewResults = false;
        this.focusedIndex = -1;
        this.selectionsAreShowing = false;
        this.searchTerm.setValue('', { emitEvent: false });
        this.closed.emit();
        this._cdRef.detectChanges();
        if (refocusInput) {
            this._focusInput();
        }
    }

    onReset() {
        this.clearSearch.emit();
        this.searchTerm.setValue('');
        this.showResults();
        this._focusInput();
    }

    onChevronClick() {
        this.showResults();
        this._focusInput();
    }

    onListItemTab(event: Event, index: number) {
        const { li, children } = this._focusableChildren(index);
        const lastFocusableChild = children[children.length - 1] ?? li;

        if (event.target !== lastFocusableChild) return;
        if (index + 1 >= this.displayItems.length) return;
        event.preventDefault();
        this.focusedIndex = index + 1;

        this._cdRef.detectChanges();
        const next = this._focusableChildren(this.focusedIndex);
        (next.children[0] ?? next.li).focus();
    }

    onListItemShiftTab(event: Event, index: number) {
        const { li, children } = this._focusableChildren(index);
        const firstFocusableChild = children[0] ?? li;

        if (event.target !== firstFocusableChild) return;
        event.preventDefault();
        if (index === 0) {
            this._focusInput();
            return;
        }
        this.focusedIndex = index - 1;

        this._cdRef.detectChanges();
        const prev = this._focusableChildren(this.focusedIndex);
        (prev.children[prev.children.length - 1] ?? prev.li).focus();
    }

    onDrilldown(item: IPickerItem) {
        this._setDisplayItemsFromParentId(item.id);
        this.desc.emit(item);
        this._cdRef.detectChanges();
        this._focusListItem(0);
    }

    getPlaceholderText() {
        return this.getSelections().length ? this.placeholderText : this.noSelectionsPlaceholderText;
    }

    getMaxHeight(el: HTMLElement) {
        // no dynamic height for mobile
        if (this.isMobileDisplay) {
            return;
        }

        if (this.isHeightDynamic) {
            const appContainer = document.querySelector('.app-container') as HTMLElement;
            const appContainerOffsetTop = appContainer.getBoundingClientRect().top;
            const elOffsetTop = el.getBoundingClientRect().top;
            const buffer = 50;

            const height = appContainer.offsetHeight - (elOffsetTop - appContainerOffsetTop);

            if (height < this.maxHeight) {
                return height - buffer + 'px';
            }
        }
        return;
    }

    private _setDisplayItemsFromParentId(parentId: number | string | null) {
        if (!this.hasChildren(parentId)) {
            return;
        }
        this._resetSearchTerm();
        this.parentId = parentId;
        this.displayItems = this.items.filter(i => i.parentId === parentId);
        this.focusedIndex = -1;
    }

    // Returns focus to the search input and clears the focused list item index.
    private _focusInput() {
        this.focusedIndex = -1;
        this.inputEl.nativeElement.focus();
    }

    // Opens the results dropdown and moves focus to the first list item.
    // Used when the user triggers a key action (ArrowDown/Enter) while the dropdown is closed.
    private _openResultsAndFocusFirstItem() {
        this.showResults();
        this._cdRef.detectChanges();
        this._focusListItem(0);
    }

    private _focusPrevItem(event: Event) {
        event.preventDefault();
        if (this.focusedIndex <= 0) {
            this._focusInput();
            return;
        }
        this._focusListItem(this.focusedIndex - 1);
        this._cdRef.markForCheck();
    }

    private _toggleDescendants(item: IPickerItem, add?: boolean, exclude?: boolean) {
        this.items
            .filter(ci => ci.parentId === item.id)
            .forEach(ci => {
                if (!isUndefined(add)) {
                    ci.added = add;
                }

                if (!isUndefined(exclude)) {
                    ci.excluded = exclude;
                }

                this._toggleDescendants(ci, add, exclude);
            });
    }

    private _toggleAncestors(item: IPickerItem, add?: boolean, exclude?: boolean) {
        this.items
            .filter(ci => ci.id === item.parentId)
            .forEach(ci => {
                if (!isUndefined(add)) {
                    ci.added = add;
                }

                if (!isUndefined(exclude)) {
                    ci.excluded = exclude;
                }

                this._toggleAncestors(ci, add, exclude);
            });
    }

    private _onListItemEscape(event: Event, index: number) {
        const li = this._elementRef.nativeElement.querySelector(
            `#${this.pickerId}-option-${this.displayItems[index].id}`
        );
        if (event.target === li) {
            this.closeResults();
        } else {
            event.stopPropagation();
            li?.focus();
        }
    }

    private _getActiveListItems(): QueryList<ElementRef> {
        return this.selectionsAreShowing ? this.selectionsListItems : this.optionsListItems;
    }

    private _focusListItem(index: number) {
        this.focusedIndex = index;
        const items = this._getActiveListItems().toArray();
        items?.[index].nativeElement.focus();
    }

    private _onArrowLeft(event: Event) {
        if (!this.parentId) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const parentItem = this.getParentItem(this.parentId);
        this._setDisplayItemsFromParentId(parentItem!.parentId);
        this.asc.emit(parentItem);
        this._cdRef.detectChanges();
        const index = this.displayItems.findIndex(i => i.id === parentItem!.id);
        this._focusListItem(index >= 0 ? index : 0);
    }

    private _focusableChildren(index: number): { li: HTMLElement; children: HTMLElement[] } {
        const li = this.optionsListItems.toArray()[index]?.nativeElement as HTMLElement;
        const children = Array.from(li?.querySelectorAll('input, button') ?? []) as HTMLElement[];
        return { li, children };
    }

    private _resetSearchTerm() {
        this.searchTerm.setValue('', { emitEvent: false });
    }

    private _subscribeToSearchTermChanges() {
        const sub = this.searchTerm.valueChanges.subscribe(val => {
            this.selectionsAreShowing = false;
            this.focusedIndex = -1;
            this.canViewResults = true;

            if (val.length) {
                const displayItems = this.items.filter(item => {
                    return (
                        (item.searchValues || []).some(value => {
                            return value.toLowerCase().includes(val.toLowerCase());
                        }) || item.displayName.toLowerCase().includes(val.toLowerCase())
                    );
                });
                // remove duplicate items
                this.displayItems = displayItems.reduce<IPickerItem[]>(
                    (items, item) => (items.find(x => x.id === item.id) ? items : [...items, item]),
                    []
                );
            } else {
                this._setDisplayItemsFromParentId(this.parentId);
            }
        });

        this._subs.push(sub);
    }

    private _announce(text: string) {
        this._liveAnnouncer.announce(text, 'polite');
    }

    ngOnDestroy() {
        this._subs.forEach(sub => sub.unsubscribe());
    }
}
