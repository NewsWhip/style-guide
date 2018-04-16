import { Component, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, trigger, transition, animate, style, state, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription'
import { IPickerItem } from './IPickerItem';
import * as _ from 'lodash';

@Component({
	selector: 'nw-angular-picker',
	template: `
		<div class="nw-picker">
			<!-- START: NOT xs screen -->
			<input type="text" #inputEl
				class="form-control search-input {{inputClasses}} hidden-xs text-ellipsis"
				[formControl]="searchTerm"
				(focus)="onFocus()"
                (blur)="closeResults($event)"
                (keyup.escape)="inputEl.blur()"
				placeholder="{{getPlaceholderText()}}"/>

			<i (click)="showResults();inputEl.focus()" class="caret dropdown-icon hidden-xs"></i>
			<!-- END: NOT xs screen -->

			<!-- START: IS xs screen -->
			<div (click)="showResults()" class="form-control search-input hidden-sm hidden-md hidden-lg text-ellipsis">{{getPlaceholderText()}}</div>
			<i (click)="showResults()" class="caret dropdown-icon hidden-sm hidden-md hidden-lg"></i>
			<!-- END: IS xs screen -->


			<button *ngIf="searchTerm.value"
				(mousedown)="preventBlur($event)"
				(click)="onReset($event);inputEl.focus()" class="close reset-icon">&times;</button>

			<div class="search-results" *ngIf="canViewResults"
				[@slideUpIn]="isMobileDisplay ? 'in' : false"
				(mousedown)="preventBlur($event)">

				<!-- Navigate up the tree -->
				<div class="results-actions" *ngIf="parentId && displayItems.length && !searchTerm.value.length">
					<a href="javascript:;" class="nw-link nw-link-tertiary" (click)="ascend(getParentItem(parentId))">
						<i class="fa fa-long-arrow-left" aria-hidden="true"></i>
						{{getParentItem(parentId).displayName}}
					</a>
				</div>

                <div class="scroll-container" #searchResultsScrollEl
                    [style.max-height]="getMaxHeight(searchResultsScrollEl)">
    				<div class="results-header">
    					<button class="close" (click)="closeResults()" style="color: #000">&times;</button>
    				</div>

    				<div class="results-actions" *ngIf="shouldShowSelections && !selectionsAreShowing && parentId == null && !searchTerm.value.length">
    					<ng-container *ngIf="getSelections().length">
							<a href="javascript:;" class="nw-link nw-link-tertiary" (click)="selectionsAreShowing = true; edit.emit()">Edit selections</a>
							<a href="javascript:;" class="nw-link nw-link-tertiary" (click)="clearSelections($event)">Clear selections</a>
    					</ng-container>

    					<ng-container *ngIf="!getSelections().length">
    						<em>No selections</em>
    					</ng-container>
    				</div>

					<!-- DISPLAY THE SELECTED ITEMS -->
					<ng-container *ngIf="selectionsAreShowing">
						<div class="results-actions">
							<a href="javascript:;" class="nw-link nw-link-tertiary" (click)="selectionsAreShowing = false">
								<i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back
							</a>
							<a href="javascript:;" class="nw-link nw-link-tertiary" *ngIf="getSelections().length" (click)="clearSelections($event)">Clear all</a>
						</div>
					
						<div class="selected-items">
    						<div class="search-result"
    							[ngClass]="{ 'active': item.added, 'excluded': item.excluded }"
    							*ngFor="let item of getSelections()">

    							<span class="result-item">
    								<span class="item-label">{{item.displayName}}</span>

    								<button class="close" style="color: #000000" (click)="clearSelection(item)">
    									&times;
    								</button>
    							</span>

    						</div>
    					</div>
					</ng-container>

    				<ng-container *ngIf="!selectionsAreShowing">
						<div class="search-result" *ngFor="let item of displayItems"
							[class.active]="item.added"
							[class.excluded]="item.excluded"
							[class.has-children]="hasChildren(item.id)">

							<span class="result-item">
								<div class="checkbox checkbox-placeholder" *ngIf="isMultiSelect">
									<input id="include-{{item.id}}" type="checkbox" (click)="toggleItemInclusion(item, $event)" [checked]="item.added">
									<label for="include-{{item.id}}"></label>
								</div>

								<div class="checkbox checkbox-exclusion checkbox-placeholder" *ngIf="canExclude && isMultiSelect">
									<input id="exclude-{{item.id}}" type="checkbox" (click)="toggleItemExclusion(item, $event)" [checked]="item.excluded">
									<label for="exclude-{{item.id}}"></label>
								</div>

								<span class="item-label" title="{{item.displayName}}" (click)="toggleItemInclusion(item, $event)">
									{{item.displayName}}
									<ng-container *ngIf="searchTerm.value.length && item.searchValues?.length">
										<span> - 
											<em class="small" *ngFor="let val of item.searchValues; let isLast=last">{{val}}{{isLast ? '' : ', '}}</em>
										</span>
									</ng-container>
								</span>

								<button class="btn btn-ghost drilldown" *ngIf="hasChildren(item.id)" (click)="setDisplayItemsFromParentId(item.id, $event); desc.emit(getParentItem(parentId))">
									<i class="fa fa-chevron-right" aria-hidden="true"></i>
								</button>
                            </span>

    					</div>


                        <div class="results-actions" *ngIf="displayItems.length < 1">
							<em>No results</em>
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

	close() {
		this.inputEl.nativeElement.blur();
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