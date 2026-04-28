import {
    Component,
    ContentChildren,
    QueryList,
    Input,
    ElementRef,
    ViewChild,
    OnInit,
    ChangeDetectorRef,
    OnDestroy,
    ChangeDetectionStrategy,
    AfterContentInit,
    inject
} from '@angular/core';
import { TabDirective } from './tab.directive';
import { fromEvent, Subscription, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TabsService } from './tabs.service';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'nw-tabs',
    templateUrl: './tabs.component.html',
    providers: [TabsService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            :host,
            ul,
            .scroll-container {
                position: relative;
            }
        `
    ],
    imports: [NgClass, NgStyle, NgTemplateOutlet]
})
export class TabsComponent implements OnInit, AfterContentInit, OnDestroy {
    private _cdRef = inject(ChangeDetectorRef);
    private _tabsService = inject(TabsService);

    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() maskColor: string = '#373737';

    @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef<HTMLElement>;
    @ViewChild('activeBar', { static: true }) activeBar: ElementRef<HTMLElement>;

    @ContentChildren(TabDirective) tabs: QueryList<TabDirective> = new QueryList();

    private _scrollAndResizeSub: Subscription;
    private _activeChangeSub: Subscription;
    private _transitionEndSub: Subscription;
    private _tabsChangeSub: Subscription;
    private _paginationTolerance: number = 100;

    ngOnInit() {
        const scrollStop$ = fromEvent(this.scrollContainer.nativeElement, 'scroll');
        const windowResizeStop$ = fromEvent(window, 'resize');

        this._scrollAndResizeSub = merge(scrollStop$, windowResizeStop$)
            .pipe(debounceTime(50))
            .subscribe(() => this._cdRef.detectChanges());

        this._subscribeToActiveChange();
        this._subscribeToActiveBarTransitionEnd();
    }

    ngAfterContentInit() {
        this._subscribeToTabsChange();
    }

    getActiveStyles(): Record<string, string> {
        const tab: TabDirective = this._getActiveTab();

        if (tab) {
            const btn = tab.elRef.nativeElement.querySelector('button');
            return {
                width: (btn ?? tab.elRef.nativeElement).getBoundingClientRect().width + 'px',
                transform: `translateX(${tab.elRef.nativeElement.offsetLeft}px)`
            };
        }
        return {};
    }

    prev(): void {
        this._getScrollEl().scrollLeft -= this.clientWidth - this._paginationTolerance;
    }

    next() {
        this._getScrollEl().scrollLeft += this.clientWidth - this._paginationTolerance;
    }

    onKeydown(event: KeyboardEvent) {
        const tabs = this.tabs.toArray();
        if (!tabs.length) return;

        const focusedIndex = tabs.findIndex(t => t.elRef.nativeElement.contains(document.activeElement));
        if (focusedIndex === -1) return;

        let targetIndex: number | null = null;

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (tabs[focusedIndex].elRef.nativeElement === document.activeElement) {
                    event.preventDefault();
                    tabs[focusedIndex].activate();
                }
                return;
            case 'ArrowLeft':
                targetIndex = focusedIndex === 0 ? tabs.length - 1 : focusedIndex - 1;
                break;
            case 'ArrowRight':
                targetIndex = focusedIndex === tabs.length - 1 ? 0 : focusedIndex + 1;
                break;
            case 'Home':
                targetIndex = 0;
                break;
            case 'End':
                targetIndex = tabs.length - 1;
                break;
        }

        if (targetIndex !== null) {
            event.preventDefault();
            this.tabs.forEach(t => t.setTabindex('-1'));
            tabs[targetIndex].setTabindex('0');
            tabs[targetIndex].focus();
        }
    }

    onFocusOut() {
        setTimeout(() => {
            if (!this.scrollContainer.nativeElement.contains(document.activeElement)) {
                this.tabs.forEach(t => t.restoreTabindex());
            }
        });
    }

    get tabSizeClass(): string {
        return `nav-${this.size}`;
    }

    get background() {
        return {
            background: `linear-gradient(to left, rgba(0,0,0,0), ${this.maskColor})`
        };
    }

    get clientWidth(): number {
        return this._getScrollEl().clientWidth;
    }

    get shouldShowPagination(): boolean {
        return +(this._getScrollEl().scrollWidth / this.clientWidth).toFixed(1) >= 1;
    }

    get shouldShowPrev(): boolean {
        return this._getScrollEl().scrollLeft >= 1;
    }

    get shouldShowNext(): boolean {
        return this._getScrollEl().scrollLeft + this.clientWidth < this._getScrollEl().scrollWidth;
    }

    private _subscribeToActiveChange() {
        this._activeChangeSub = this._tabsService.activeChange.subscribe(tab => {
            this._scrollToTabIfRequired(tab);

            setTimeout(() => {
                this._cdRef.detectChanges();
            }, 0);
        });
    }

    private _subscribeToTabsChange() {
        this._tabsChangeSub = this.tabs.changes.subscribe(() => {
            setTimeout(() => {
                this._cdRef.detectChanges();
            }, 0);
        });
    }

    private _subscribeToActiveBarTransitionEnd() {
        this._transitionEndSub = fromEvent(this.activeBar.nativeElement, 'transitionend')
            .pipe(debounceTime(50))
            .subscribe(() => this._cdRef.detectChanges());
    }

    private _getActiveTab(): TabDirective {
        return this.tabs.filter(t => t.isActive)[0];
    }

    private _getScrollEl(): HTMLElement {
        return this.scrollContainer.nativeElement;
    }

    private _scrollToTabIfRequired(tab: TabDirective) {
        const offsetLeft = tab.elRef.nativeElement.offsetLeft;
        const position = {
            left: offsetLeft,
            right: offsetLeft + tab.elRef.nativeElement.clientWidth
        };

        const shouldScrollLeft: boolean = position.left < this._getScrollEl().scrollLeft;
        const shouldScrollRight: boolean = position.right > this._getScrollEl().scrollLeft + this.clientWidth;

        if (shouldScrollLeft) {
            this._getScrollEl().scrollLeft = position.left - 30;
        } else if (shouldScrollRight) {
            this._getScrollEl().scrollLeft = position.right - this.clientWidth + 12 + 30; // plus 12 for margin
        }
    }

    ngOnDestroy() {
        this._scrollAndResizeSub.unsubscribe();
        this._activeChangeSub.unsubscribe();
        this._transitionEndSub.unsubscribe();
        this._tabsChangeSub.unsubscribe();
    }
}
