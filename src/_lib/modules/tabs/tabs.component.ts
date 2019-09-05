import { Component, ContentChildren, QueryList, Input, ElementRef, ViewChild, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
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

                <li #activeBar class="nav-tabs-active-bar" [ngStyle]="getActiveStyles()"></li>
            </ul>
        </div>

        <div class="pagination-container" *ngIf="shouldShowPagination">
            <div class="prev-page" *ngIf="shouldShowPrev" (click)="prev()" [ngStyle]="background">
                <ng-container *ngTemplateOutlet="paginator"></ng-container>
            </div>
            <div class="next-page" *ngIf="shouldShowNext" (click)="next()" [ngStyle]="background">
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

export class TabsComponent implements OnInit, AfterContentInit, OnDestroy {

    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() maskColor: string = '#373737';

    @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;
    @ViewChild('activeBar') activeBar: ElementRef<HTMLElement>;

    @ContentChildren(TabDirective) tabs: QueryList<TabDirective> = new QueryList();

    private _scrollAndResizeSub: Subscription;
    private _activeChangeSub: Subscription;
    private _transitionEndSub: Subscription;
    private _tabsChangeSub: Subscription;
    private _paginationTolerance: number = 100;

    constructor(
        private _cdRef: ChangeDetectorRef,
        private _tabsService: TabsService) {}

    ngOnInit() {
        const scrollStop$: Observable<Event> = fromEvent(this.scrollContainer.nativeElement, 'scroll');
        const windowResizeStop$: Observable<Event> = fromEvent(window, 'resize');

        this._scrollAndResizeSub = merge(scrollStop$, windowResizeStop$)
            .pipe(debounceTime(50))
            .subscribe(_ => this._cdRef.detectChanges());

        this.subscribeToActiveChange();
        this.subscribeToActiveBarTransitionEnd();
    }

    ngAfterContentInit() {
        this.subscribeToTabsChange();
    }

    subscribeToActiveChange() {
        this._activeChangeSub = this._tabsService.activeChange.subscribe(tab => {
            this.scrollToTabIfRequired(tab);

            setTimeout(() => {
                this._cdRef.detectChanges();
            }, 0);
        });
    }

    subscribeToTabsChange() {
        this._tabsChangeSub = this.tabs.changes.subscribe(tabs => {
            setTimeout(() => {
                this._cdRef.detectChanges();
            }, 0);
        });
    }

    subscribeToActiveBarTransitionEnd() {
        this._transitionEndSub = fromEvent(this.activeBar.nativeElement, 'transitionend')
            .pipe(debounceTime(50))
            .subscribe(() => {
                console.log('transition ended');
                this._cdRef.detectChanges();
            })
    }

    getActiveTab(): TabDirective {
        return this.tabs.filter(t => t.isActive)[0];
    }

    get tabSizeClass(): string {
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

    getScrollEl(): HTMLElement {
        return this.scrollContainer.nativeElement;
    }

    get background() {
        return {
            'background': `linear-gradient(to left, rgba(0,0,0,0), ${this.maskColor})`
        }
    }

    get clientWidth(): number {
        return this.getScrollEl().clientWidth;
    }

    get shouldShowPagination(): boolean {
        return +(this.getScrollEl().scrollWidth / this.clientWidth).toFixed(1) >= 1;
    }

    get shouldShowPrev(): boolean {
        return this.getScrollEl().scrollLeft >= 1;
    }

    get shouldShowNext(): boolean {
        return this.getScrollEl().scrollLeft + this.clientWidth < this.getScrollEl().scrollWidth;
    }

    prev(): void {
        this.getScrollEl().scrollLeft -= (this.clientWidth - this._paginationTolerance);
    }

    next() {
        this.getScrollEl().scrollLeft += (this.clientWidth - this._paginationTolerance);
    }

    scrollToTabIfRequired(tab: TabDirective) {
        const offsetLeft = tab.elRef.nativeElement.offsetLeft;
        const position = {
            left: offsetLeft,
            right: offsetLeft + tab.elRef.nativeElement.clientWidth
        };

        const shouldScrollLeft: boolean = position.left < this.getScrollEl().scrollLeft;
        const shouldScrollRight: boolean = position.right > (this.getScrollEl().scrollLeft +  + this.clientWidth);

        if (shouldScrollLeft) {
            this.getScrollEl().scrollLeft = position.left - 30;
        } else if (shouldScrollRight) {
            this.getScrollEl().scrollLeft = position.right - this.clientWidth + 12 + 30; // plus 12 for margin
        }
    }

    ngOnDestroy() {
        this._scrollAndResizeSub.unsubscribe();
        this._activeChangeSub.unsubscribe();
        this._transitionEndSub.unsubscribe();
        this._tabsChangeSub.unsubscribe();
    }
}
