import {
    Component,
    Input,
    Output,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    EventEmitter,
    ViewChild,
    ElementRef,
    OnInit,
    OnDestroy,
    SimpleChanges,
    OnChanges,
    inject
} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
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
    animations: [
        trigger('slideUpIn', [
            transition('void => in', [
                style({ top: '100%', transform: 'scale(0)' }),
                animate(200, style({ top: 0, transform: 'scale(1)' }))
            ]),
            transition('in => void', [animate(200, style({ top: '100%', transform: 'scale(0)' }))])
        ])
    ],
    imports: [ReactiveFormsModule, NgClass]
})
export class NwPickerComponent implements OnInit, OnChanges, OnDestroy {
    chRef = inject(ChangeDetectorRef);

    private static _idCounter = 0;
    public readonly pickerId: string;

    @Input() items: IPickerItem[];
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
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() focus: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
    @Output() blur: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
    @Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
    @Output() clearSingle: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
    @Output() clearSearch: EventEmitter<any> = new EventEmitter<any>();
    @Output() desc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
    @Output() asc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();

    @ViewChild('inputEl', { static: true }) inputEl: ElementRef;

    public displayItems: IPickerItem[];
    public searchTerm: FormControl<string> = new FormControl();
    public canViewResults: boolean = false;
    public parentId: any;
    public selectionsAreShowing: boolean = false;
    public maxHeight: number = 400;
    public focusedIndex: number = -1;
    private _subs: Subscription[] = [];

    constructor(private _elementRef: ElementRef, private _liveAnnouncer: LiveAnnouncer) {
        this.pickerId = `nw-picker-${++NwPickerComponent._idCounter}`;
    }

    get focusedItemId(): string | null {
        if (this.focusedIndex >= 0 && this.displayItems?.[this.focusedIndex]) {
            return `${this.pickerId}-option-${this.displayItems[this.focusedIndex].id}`;
        }
        return null;
    }

    ngOnInit() {
        this.parentId = this.initialParentId;
        this.subscribeToSearchTermChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isDisabled) {
            this.searchTerm.disable();
        }
    }

    subscribeToSearchTermChanges() {
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
                this.displayItems = displayItems.reduce(
                    (items, item) => (items.find(x => x.id === item.id) ? [...items] : [...items, item]),
                    []
                );
            } else {
                this.setDisplayItemsFromParentId(this.parentId);
            }
        });

        this._subs.push(sub);
    }

    ascend(event: Event, item: IPickerItem) {
        event.stopPropagation();
        // Move focus to input before re-rendering the list, so removing the
        // currently-focused <li> from the DOM doesn't fire a focusout with
        // relatedTarget=null, which would otherwise close the dropdown.
        this.inputEl.nativeElement.focus();
        this.setDisplayItemsFromParentId(item.parentId);
        this.asc.emit(item);
        this.chRef.detectChanges();
        this.focusedIndex = 0;
        this.focusListItem(0);
    }

    setDisplayItemsFromParentId(parentId) {
        if (!this.hasChildren(parentId)) {
            return;
        }
        this.resetSearchTerm();
        this.parentId = parentId;
        this.displayItems = this.items.filter(i => i.parentId === this.parentId);
        this.focusedIndex = -1;
    }

    displaySelectedItems() {
        this.displayItems = this.getSelections();
    }

    getSelections() {
        return this.items.filter(ci => ci.added || ci.excluded);
    }

    getParentItem(parentId) {
        return this.items.find(i => i.id === parentId);
    }

    hasChildren(id) {
        return this.items.filter(i => i.parentId === id).length;
    }

    editSelections(event: Event) {
        event.stopPropagation();
        this.inputEl.nativeElement.focus();
        this.selectionsAreShowing = true;
        this.edit.emit(event);
    }

    onBackClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.inputEl.nativeElement.focus();
        this.selectionsAreShowing = false;
        this.setDisplayItemsFromParentId(null);
        this.selections.emit(this.getSelections());
    }

    clearSelection(event: Event, item: IPickerItem) {
        event.preventDefault();
        event.stopPropagation();
        this.inputEl.nativeElement.focus();
        item.added = false;
        item.excluded = false;

        this.clearSingle.emit(item);

        if (this.getSelections().length < 1) {
            this.setDisplayItemsFromParentId(null);
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

        this.setDisplayItemsFromParentId(null);
        this.selectionsAreShowing = false;

        this.selections.emit(this.getSelections());
        this.announce('All selections cleared');
    }

    toggleItemInclusion(item: IPickerItem, e: Event) {
        e.stopPropagation();

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

        this.toggleAncestors(item, false, false);
        this.toggleDescendants(item, false);

        this.toggleInclude.emit({ item: item, searchTerm: this.searchTerm.value });
        this.selections.emit(this.getSelections());
        this.announce(`${item.displayName} ${item.added ? 'selected' : 'deselected'}`);

        if (!this.isMultiSelect) {
            this.closeResults();
        }
    }

    toggleItemExclusion(item: IPickerItem, e: Event) {
        e.stopPropagation();

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

        this.toggleDescendants(item, false, false);
        this.toggleAncestors(item, undefined, false);

        this.toggleExclude.emit({ item: item, searchTerm: this.searchTerm.value });
        this.selections.emit(this.getSelections());
        this.announce(`${item.displayName} ${item.excluded ? 'excluded' : 'exclusion removed'}`);

        if (!this.isMultiSelect) {
            this.closeResults();
        }
    }

    toggleDescendants(item: IPickerItem, add?: boolean, exclude?: boolean) {
        this.items
            .filter(ci => ci.parentId === item.id)
            .forEach(ci => {
                if (!isUndefined(add)) {
                    ci.added = add;
                }

                if (!isUndefined(exclude)) {
                    ci.excluded = exclude;
                }

                this.toggleDescendants(ci, add, exclude);
            });
    }

    toggleAncestors(item: IPickerItem, add?: boolean, exclude?: boolean) {
        this.items
            .filter(ci => ci.id === item.parentId)
            .forEach(ci => {
                if (!isUndefined(add)) {
                    ci.added = add;
                }

                if (!isUndefined(exclude)) {
                    ci.excluded = exclude;
                }

                this.toggleAncestors(ci, add, exclude);
            });
    }

    getAriaLabel(item: IPickerItem) {
        let label = item.displayName;
        if (item.added) label += ', selected';
        if (item.excluded) label += ', excluded';
        if (this.hasChildren(item.id)) label += ', has sub-items';
        return label;
    }

    // ── Keyboard navigation ────────────────────────────────────────────────

    focusNextItem(e: Event) {
        e.preventDefault();
        if (!this.canViewResults) {
            this.showResults();
            this.chRef.detectChanges();
            this.focusedIndex = 0;
            this.focusListItem(0);
            return;
        }
        const listLength = this.selectionsAreShowing ? this.getSelections().length : this.displayItems?.length;
        if (listLength) {
            const newIndex = Math.min(this.getActiveItemIndex() + 1, listLength - 1);
            this.focusedIndex = newIndex;
            this.focusListItem(newIndex);
            this.chRef.markForCheck();
        }
    }

    focusPrevItem(e: Event) {
        e.preventDefault();
        const listLength = this.selectionsAreShowing ? this.getSelections().length : this.displayItems?.length;
        if (!listLength) { 
            return; 
        }
        const currentIndex = this.getActiveItemIndex();
        if (currentIndex <= 0) {
            this.focusedIndex = -1;
            this.inputEl.nativeElement.focus();
            return;
        }
        const newIndex = currentIndex - 1;
        this.focusedIndex = newIndex;
        this.focusListItem(newIndex);
        this.chRef.markForCheck();
    }

    onInputEnter(e: Event) {
        if (!this.canViewResults) {
            this.showResults();
            this.chRef.detectChanges();
            this.focusedIndex = 0;
            this.focusListItem(0);
            return;
        }
        if (this.focusedIndex >= 0 && this.displayItems?.[this.focusedIndex]) {
            e.preventDefault();
            this.toggleItemInclusion(this.displayItems[this.focusedIndex], e);
        }
    }

    onListItemEscape(e: Event, index: number) {
        const li = this._elementRef.nativeElement.querySelector(
            `#${this.pickerId}-option-${this.displayItems[index].id}`
        );
        if (e.target === li) {
            this.closeResults();
        } else {
            e.stopPropagation();
            li?.focus();
        }
    }

    private getActiveListbox(): Element | null {
        const id = this.selectionsAreShowing
            ? `${this.pickerId}-selections-listbox`
            : `${this.pickerId}-listbox`;
        return this._elementRef.nativeElement.querySelector(`#${id}`);
    }

    private focusListItem(index: number) {
        const items = this.getActiveListbox()?.querySelectorAll(':scope > li') as NodeListOf<HTMLElement> | undefined;
        items?.[index]?.focus();
    }

    private getActiveItemIndex(): number {
        const listbox = this.getActiveListbox();
        if (!listbox) { return this.focusedIndex; }
        const items = Array.from(listbox.querySelectorAll(':scope > li')) as HTMLElement[];
        const idx = items.findIndex(li => li === document.activeElement || li.contains(document.activeElement));
        return idx >= 0 ? idx : this.focusedIndex;
    }

    onContainerFocusOut() {
        // Defer the check so that programmatic focus changes (e.g. focusListItem)
        // and DOM re-renders (which can fire focusout with relatedTarget=null when
        // the focused element is destroyed) have all settled before we decide
        // whether focus has genuinely left the component.
        setTimeout(() => {
            if (!this._elementRef.nativeElement.contains(document.activeElement)) {
                this.closeResults(false);
                this.blur.emit(this.inputEl);
            }
        });
    }

    // ── Misc ───────────────────────────────────────────────────────────────

    preventBlur(e: Event) {
        // prevent blurring of the search input
        e.preventDefault();
    }

    resetSearchTerm() {
        this.searchTerm.setValue('', { emitEvent: false });
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
            this.setDisplayItemsFromParentId(this.parentId);
        }
    }

    close() {
        this.inputEl.nativeElement.blur();
    }

    closeResults(refocusInput: boolean = true) {
        if (!this.canViewResults) { return; }
        this.canViewResults = false;
        this.focusedIndex = -1;
        this.searchTerm.setValue('', { emitEvent: false });
        this.closed.emit();
        this.chRef.detectChanges();
        if (refocusInput) {
            this.inputEl?.nativeElement.focus();
        }
    }

    onReset() {
        this.clearSearch.emit();
        this.searchTerm.setValue('');
        this.showResults();
        this.inputEl.nativeElement.focus();
    }

    onChevronClick() {
        this.showResults();
        this.inputEl.nativeElement.focus();
    }

    onDrilldown(item: IPickerItem, e: Event) {
        this.setDisplayItemsFromParentId(item.id);
        this.desc.emit(item);
        this.chRef.detectChanges();
        this.focusedIndex = 0;
        this.focusListItem(0);
    }

    onArrowLeft(e: Event) {
        if (!this.parentId) { return; }
        e.preventDefault();
        e.stopPropagation();
        const parentItem = this.getParentItem(this.parentId);
        this.inputEl.nativeElement.focus();
        this.setDisplayItemsFromParentId(parentItem.parentId);
        this.asc.emit(parentItem);
        this.chRef.detectChanges();
        const idx = this.displayItems.findIndex(i => i.id === parentItem.id);
        this.focusedIndex = idx >= 0 ? idx : 0;
        this.focusListItem(this.focusedIndex);
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

    private announce(text: string) {
        this._liveAnnouncer.announce(text, 'polite');
    }

    ngOnDestroy() {
        this._subs.forEach(sub => sub.unsubscribe());
    }
}
