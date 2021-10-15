import { Component, ContentChildren, QueryList, Input, ElementRef, ViewChild, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, AfterContentInit, AfterViewInit } from '@angular/core';
import { TabDirective } from './tab.directive';
import { fromEvent, Subscription, Observable, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TabsService } from './tabs.service';

@Component({
    selector: 'nw-tabs',
    template: `
        <div class="scroll-container" #scrollContainer>
            <ul class="nav nav-tabs" [ngClass]="tabSizeClass" role="tablist">
                <ng-content></ng-content>

                <li #activeBar class="nav-tabs-active-bar" [ngStyle]="activeStyles"></li>
            </ul>
        </div>

        <div class="pagination-container" *ngIf="shouldShowPagination">
            <div class="prev-page" *ngIf="shouldShowPrev" (click)="prev()" [ngStyle]="paginationButtonStyles">
                <ng-container *ngTemplateOutlet="paginator"></ng-container>
            </div>
            <div class="next-page" *ngIf="shouldShowNext" (click)="next()" [ngStyle]="paginationButtonStyles">
                <ng-container *ngTemplateOutlet="paginator"></ng-container>
            </div>
        </div>

        <ng-template #paginator>
            <button class="btn btn-md btn-ghost-alt">
                <i class="fas fa-chevron-left"></i>
            </button>
        </ng-template>
     `,
    providers: [TabsService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        :host, ul {
            position: relative;
        }
    `]
})

export class TabsComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {

    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() maskColor: string = '#373737';

    @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef<HTMLElement>;
    @ViewChild('activeBar', { static: true }) activeBar: ElementRef<HTMLElement>;

    @ContentChildren(TabDirective) tabs: QueryList<TabDirective> = new QueryList();

    public activeStyles: { [key: string]: string };
    public paginationButtonStyles: { [key: string]: string };
    public tabSizeClass: string;
    public shouldShowPagination: boolean;
    public scrollEl: HTMLElement;
    public clientWidth: number;

    private _scrollAndResizeSub: Subscription;
    private _activeChangeSub: Subscription;
    private _tabsChangeSub: Subscription;
    private _paginationTolerance: number = 100;
    private _buttonWidth: number = 35;

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _tabsService: TabsService) {}

    ngOnInit() {
        this.scrollEl = this.scrollContainer.nativeElement;
        this.paginationButtonStyles = this.getPaginationButtonStyles();
        this.tabSizeClass = this.getTabSizeClass();

        const scrollStop$: Observable<Event> = fromEvent(this.scrollEl, 'scroll');
        const windowResizeStop$: Observable<Event> = fromEvent(window, 'resize');

        this._scrollAndResizeSub = merge(scrollStop$, windowResizeStop$)
            .pipe(debounceTime(50))
            .subscribe(_ => {
                this.clientWidth = this.getClientWidth();
                this.shouldShowPagination = this._shouldShowPagination();
                this._cdRef.detectChanges();
            });

        this.subscribeToActiveChange();
    }

    ngAfterContentInit() {
        this.subscribeToTabsChange();
    }

    ngAfterViewInit() {
        /**
         * These methods need the template to be rendered before executing
         */
        this.clientWidth = this.getClientWidth();
        this.activeStyles = this.getActiveStyles();
        this.shouldShowPagination = this._shouldShowPagination();
        this._cdRef.detectChanges();
    }

    subscribeToActiveChange() {
        this._activeChangeSub = this._tabsService.activeChange.subscribe(tab => {
            this.scrollToTabIfRequired(tab);
            this.activeStyles = this.getActiveStyles();
            this._cdRef.detectChanges();
        });
    }

    subscribeToTabsChange() {
        this._tabsChangeSub = this.tabs.changes.subscribe(tabs => {
            this.activeStyles = this.getActiveStyles();
            this._cdRef.detectChanges();
        });
    }

    getActiveTab(): TabDirective {
        return this.tabs.filter(t => t.isActive)[0];
    }

    getTabSizeClass(): string {
        return `nav-${this.size}`;
    }

    getActiveStyles(): { [key: string]: string } {
        const tab: TabDirective = this.getActiveTab();

        if (tab) {
            return {
                width: tab.elRef.nativeElement.getBoundingClientRect().width + 'px',
                left: tab.elRef.nativeElement.offsetLeft + 'px'
            };
        }
        return {};
    }

    getPaginationButtonStyles() {
        return {
            'background': `linear-gradient(to left, rgba(0,0,0,0), ${this.maskColor})`
        };
    }

    getClientWidth(): number {
        return this.scrollEl.clientWidth;
    }

    private _shouldShowPagination(): boolean {
        return +(this.scrollEl.scrollWidth / this.clientWidth).toFixed(1) >= 1;
    }

    get shouldShowPrev(): boolean {
        return this.scrollEl.scrollLeft >= 1;
    }

    get shouldShowNext(): boolean {
        return this.scrollEl.scrollLeft + this.clientWidth < this.scrollEl.scrollWidth;
    }

    prev(): void {
        this.scrollEl.scrollLeft -= (this.clientWidth - this._paginationTolerance);
    }

    next() {
        this.scrollEl.scrollLeft += (this.clientWidth - this._paginationTolerance);
    }

    scrollToTabIfRequired(tab: TabDirective) {
        const offsetLeft = tab.elRef.nativeElement.offsetLeft;
        const position = {
            left: offsetLeft,
            right: offsetLeft + tab.elRef.nativeElement.clientWidth
        };

        const shouldScrollLeft: boolean = position.left < (this.scrollEl.scrollLeft + this._buttonWidth);
        const shouldScrollRight: boolean = position.right > (this.scrollEl.scrollLeft + this.clientWidth - this._buttonWidth);

        if (shouldScrollLeft) {
            this.scrollEl.scrollLeft = position.left - this._buttonWidth;
        } else if (shouldScrollRight) {
            this.scrollEl.scrollLeft = position.right - this.clientWidth + this._buttonWidth;
        }
    }

    ngOnDestroy() {
        this._scrollAndResizeSub.unsubscribe();
        this._activeChangeSub.unsubscribe();
        this._tabsChangeSub.unsubscribe();
    }
}
