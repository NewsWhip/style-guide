import { Component, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, trigger, transition, animate, style, state, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription'
import { IPickerItem } from './IPickerItem';
import * as _ from 'lodash';

@Component({
	selector: 'nw-angular-picker',
	template: `
		<div class="nw-picker">
			<! -- START: NOT xs screen -->
			<input type="text" #inputEl
				class="form-control search-input {{inputClasses}} hidden-xs text-ellipsis"
				[formControl]="searchTerm"
				(focus)="onFocus()"
                (blur)="closeResults($event)"
                (keyup.escape)="inputEl.blur()"
				placeholder="{{getPlaceholderText()}}"/>

			<span class="search-icon" #ref><ng-content select=".custom-search-icon"></ng-content></span> 

			<span *ngIf="ref.children.length == 0" class="search-icon">
				<i class="fa fa-search" aria-hidden="true"></i>
			</span>

			<i (click)="showResults();inputEl.focus()" class="caret dropdown-icon hidden-xs"></i>
			<! -- END: NOT xs screen -->


			<! -- START: IS xs screen -->
			<div (click)="showResults()" class="form-control hidden-sm hidden-md hidden-lg text-ellipsis">{{getPlaceholderText()}}</div>
			<i (click)="showResults()" class="caret dropdown-icon hidden-sm hidden-md hidden-lg"></i>
			<! -- END: IS xs screen -->


			<span *ngIf="searchTerm.value"
				(mousedown)="preventBlur($event)"
				(click)="onReset($event);inputEl.focus()" class="reset-icon">&times;</span>

			<div class="search-results" *ngIf="canViewResults"
				[@slideUpIn]="isMobileDisplay ? 'in' : false"
				(mousedown)="preventBlur($event)">

				<div class="parent" *ngIf="parentId && displayItems.length && !searchTerm.value.length" 
					(click)="ascend(getParentItem(parentId))">

					<span class="drillup">
						<i class="fa fa-chevron-left" aria-hidden="true"></i>
					</span>
					<span class="result-item">{{getParentItem(parentId).displayName}}</span>
				</div>

                <div class="scroll-container"
                    #searchResultsScrollEl
                    [style.max-height]="getMaxHeight(searchResultsScrollEl)">
    				<div class="results-header">
    					<span class="nav-back" style="cursor:pointer" (click)="closeResults()">&times;</span>
    				</div>

    				<ng-container *ngIf="shouldShowSelections && !selectionsAreShowing && parentId == null && !searchTerm.value.length">
    					<div class="search-result item-selection-list" *ngIf="getSelections().length" (click)="selectionsAreShowing = true; edit.emit()">
    						<span class="result-item">
    							<span style="flex:1">Edit selections...</span>
    							<span class="clear-selections pull-right" (click)="clearSelections($event)">Clear all</span>
    						</span>
    					</div>

    					<div class="search-result item-selection-list is-empty" *ngIf="!getSelections().length">
    						<span class="result-item"><em class="pull-left">No selections</em></span>
    					</div>
    				</ng-container>

    				<!-- DISPLAY THE SELECTED ITEMS -->
    				<ng-container *ngIf="selectionsAreShowing">
    					<div class="parent" (click)="selectionsAreShowing = false">
    						<span class="drillup">
    							<i class="fa fa-chevron-left" aria-hidden="true"></i>
    						</span>
    						<span class="result-item">
    							Back
    							<span class="clear-selections pull-right" *ngIf="getSelections().length" (click)="clearSelections($event)">Clear all</span>
    						</span>
    					</div>

    					<div class="selected-items">
    						<div class="search-result"
    							[ngClass]="{ 'active': item.added, 'excluded': item.excluded }"
    							*ngFor="let item of getSelections()">

    							<span class="result-item">
    								<span class="item-label">{{item.displayName}}</span>

    								<span class="clear-selection pull-right" (click)="clearSelection(item)">
    									&#x58;
    								</span>
    							</span>

    						</div>
    					</div>
    				</ng-container>

    				<ng-container *ngIf="!selectionsAreShowing">
    					<div class="search-result"
    						(click)="toggleItemInclusion(item, $event)"
    						[ngClass]="{ 'active': item.added, 'excluded': item.excluded, 'has-children': hasChildren(item.id) }"
    						*ngFor="let item of displayItems">

    						<span class="result-item">
    							<div class="toggle-include" (click)="toggleItemInclusion(item, $event)" *ngIf="isMultiSelect">
    								<i class="fa fa-check"></i>
    							</div>

    							<div class="toggle-exclude" *ngIf="canExclude && isMultiSelect" (click)="toggleItemExclusion(item, $event)">
    								<i class="fa fa-times"></i>
    							</div>

								<span class="item-label" title="{{item.displayName}}">
									{{item.displayName}}
									<ng-container *ngIf="searchTerm.value.length && item.searchValues?.length">
										<span> - 
											<em class="small" *ngFor="let val of item.searchValues; let isLast=last">{{val}}{{isLast ? '' : ', '}}</em>
										</span>
									</ng-container>
								</span>
                            </span>

    						<span *ngIf="hasChildren(item.id)" class="drilldown" (click)="setDisplayItemsFromParentId(item.id, $event); desc.emit(getParentItem(parentId))">
    							<i class="fa fa-chevron-right" aria-hidden="true"></i>
    						</span>
    					</div>


                        <div class="search-result" *ngIf="displayItems.length < 1">
                            <span class="result-item">
                                <em class="item-label">No results</em>
                            </span>
                        </div>
    				</ng-container>
                </div>

				<ng-content select=".results-footer"></ng-content>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('slideUpIn', [
			transition('void => in', [
				style({ top: '100%', transform: 'scale(0)' }),
				animate(200, style({ top: 0, transform: 'scale(1)' }))
			]),
			transition('in => void', [
				animate(200, style({ top: '100%', transform: 'scale(0)' }))
			])
		])
	]
})

export class NwPickerComponent {

	@Input() items: IPickerItem[];
	@Input() inputClasses: string = '';
	@Input() placeholderText: string = 'Search...';
	@Input() noSelectionsPlaceholderText: string = 'Search...';
	@Input() initialParentId: any = null;
	@Input() shouldShowSelections: boolean = true;
	@Input() canExclude: boolean = true;
	@Input() isHeightDynamic: boolean;
	@Input() isMultiSelect: boolean = true;
	@Input() isMobileDisplay: boolean = false;

	@Output() selections: EventEmitter<IPickerItem[]> = new EventEmitter<IPickerItem[]>();
	@Output() toggleInclude: EventEmitter<{ item: IPickerItem, searchTerm: string }> = new EventEmitter<{ item: IPickerItem, searchTerm: string }>();
	@Output() toggleExclude: EventEmitter<{ item: IPickerItem, searchTerm: string }> = new EventEmitter<{ item: IPickerItem, searchTerm: string }>();
	@Output() edit: EventEmitter<any> = new EventEmitter<any>();
	@Output() closed: EventEmitter<any> = new EventEmitter<any>();
	@Output() focus: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
	@Output() clearAll: EventEmitter<any> = new EventEmitter<any>();
	@Output() clearSingle: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
	@Output() clearSearch: EventEmitter<any> = new EventEmitter<any>();
	@Output() desc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();
	@Output() asc: EventEmitter<IPickerItem> = new EventEmitter<IPickerItem>();

	@ViewChild('inputEl') inputEl: ElementRef;

	public displayItems: IPickerItem[];
	public searchTerm = new FormControl();
	public canViewResults: boolean = false;
	public parentId: any;
	public selectionsAreShowing: boolean = false;
	public maxHeight: number = 400;
	private _subs: Subscription[] = [];

	constructor(public chRef: ChangeDetectorRef) { }

	ngOnInit() {
		this.parentId = this.initialParentId;
		this.subscribeToSearchTermChanges();
	}

	subscribeToSearchTermChanges() {
		let sub = this.searchTerm.valueChanges.subscribe(val => {
			this.selectionsAreShowing = false;

			if (val.length) {
				this.displayItems = this.items.filter(item => {
					return (item.searchValues || []).some(value => {
						return _.includes(value.toLowerCase(), val.toLowerCase());
					}) || _.includes(item.displayName.toLowerCase(), val.toLowerCase());
				});
			}
			else {
				this.setDisplayItemsFromParentId(this.parentId);
			}
		});

		this._subs.push(sub);
	}

	ascend(item: IPickerItem) {
		this.setDisplayItemsFromParentId(item.parentId);
		this.asc.emit(item);
	}

	setDisplayItemsFromParentId(parentId, e?: KeyboardEvent) {
		if (e) {
			e.stopPropagation();
		}

		if (!this.hasChildren(parentId)) {
			return;
		}
		this.resetSearchTerm();
		this.parentId = parentId;
		this.displayItems = this.items.filter(i => i.parentId === this.parentId);
	}

	displaySelectedItems() {
		this.displayItems = this.getSelections();
	}

	getSelections() {
		return this.items.filter(ci => ci.added || ci.excluded);
	}

	getParentItem(parentId) {
		return _.find(this.items, i => i.id === parentId);
	}

	hasChildren(id) {
		return this.items.filter(i => i.parentId === id).length;
	}

	clearSelection(item: IPickerItem) {
		item.added = false;
		item.excluded = false;

		this.clearSingle.emit(item);

		if (this.getSelections().length < 1) {
			this.setDisplayItemsFromParentId(null);
			this.selectionsAreShowing = false;
		}

		this.selections.emit(this.getSelections());
	}

	clearSelections(e?: KeyboardEvent) {
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
	}

	toggleItemInclusion(item: IPickerItem, e: KeyboardEvent) {
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

		this.toggleAncestors(item, false, false);
		this.toggleDescendants(item, false);

		this.toggleInclude.emit({ item: item, searchTerm: this.searchTerm.value });
		this.selections.emit(this.getSelections());

		if (!this.isMultiSelect) {
			this.inputEl.nativeElement.blur();
		}
	}

	toggleItemExclusion(item: IPickerItem, e: KeyboardEvent) {
		e.stopPropagation();

		item.added = false;
		item.excluded = !item.excluded;

		this.toggleDescendants(item, false, false);
		this.toggleAncestors(item, undefined, false);

		this.toggleExclude.emit({ item: item, searchTerm: this.searchTerm.value });
		this.selections.emit(this.getSelections());

		if (!this.isMultiSelect) {
			this.inputEl.nativeElement.blur();
		}
	}

	toggleDescendants(item: IPickerItem, add?: boolean, exclude?: boolean) {
		this.items.filter(ci => ci.parentId === item.id).forEach(ci => {
			if (!_.isUndefined(add)) {
				ci.added = add;
			}

			if (!_.isUndefined(exclude)) {
				ci.excluded = exclude;
			}

			this.toggleDescendants(ci, add, exclude);
		});
	}

	toggleAncestors(item: IPickerItem, add?: boolean, exclude?: boolean) {
		this.items.filter(ci => ci.id === item.parentId).forEach(ci => {
			if (!_.isUndefined(add)) {
				ci.added = add;
			}

			if (!_.isUndefined(exclude)) {
				ci.excluded = exclude;
			}

			this.toggleAncestors(ci, add, exclude);
		})
	}

	preventBlur(e: KeyboardEvent) {
		// prevent blurring of the search input
		e.preventDefault();
	}

	resetSearchTerm() {
		this.searchTerm.setValue('', { emitEvent: false });
	}

	onFocus() {
		this.showResults();
		this.focus.emit(this.inputEl)
	}

	showResults() {
		this.parentId = this.initialParentId;
		this.canViewResults = true;

		this.setDisplayItemsFromParentId(this.parentId);
	}

	closeResults($event) {
		this.canViewResults = false;
		this.searchTerm.setValue('');
		this.closed.emit();
	}

	onReset($event?: KeyboardEvent) {
		this.clearSearch.emit();
		this.searchTerm.setValue('');
		this.showResults();
	}

	getPlaceholderText() {
		return this.getSelections().length ?
			this.placeholderText :
			this.noSelectionsPlaceholderText;
	}

	getMaxHeight(el: HTMLElement) {
		// no dynamic height for mobile
		if (this.isMobileDisplay) {
			return;
		}

		if (this.isHeightDynamic) {
			let appContainer = <HTMLElement>document.querySelector('.app-container');
			let appContainerOffsetTop = appContainer.getBoundingClientRect().top;
			let elOffsetTop = el.getBoundingClientRect().top;
			let buffer = 50;

			let height = appContainer.offsetHeight - (elOffsetTop - appContainerOffsetTop);

			if (height < this.maxHeight) {
				return height - buffer + 'px';
			}
		}
		return;
	}

	ngOnDestroy() {
		this._subs.forEach(sub => sub.unsubscribe());
	}

}