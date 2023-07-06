import { Directive, HostListener, QueryList, AfterContentInit, ContentChildren, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { DropdownDirective } from "./dropdown.directive";
import { filter, map, takeUntil } from "rxjs/operators";
import { Observable, merge, Subject } from 'rxjs';

@Directive({
    selector: '[nwDropdownMenu]',
    exportAs: 'nw-dropdown-menu',
    standalone: true
})
export class DropdownMenuDirective implements AfterContentInit, OnDestroy {

    @ContentChildren(DropdownDirective) nestedDropdowns: QueryList<DropdownDirective>;
    private _destroyed$: Subject<null> = new Subject();

    constructor(
        private _service: DropdownService,
        private _element: ElementRef<HTMLElement>,
        private _cdRef: ChangeDetectorRef
    ) { }

    ngAfterContentInit() {
        this._subscribeToChildrenVisbilityToggle();
        this._subscribeToScrollPosition();
    }

    private _subscribeToScrollPosition() {
        this._service.toggle$.pipe(
            filter(opened => opened),
            takeUntil(this._destroyed$)
        ).subscribe(() => {
            this._cdRef.detectChanges();
            this._scrollToActiveElement();
        });
    }

    private _scrollToActiveElement() {
        const menuElement = this._element.nativeElement;
        const activeElement: HTMLElement = this._element.nativeElement.querySelector('.active');
        if (activeElement) {
            menuElement.scrollTo({ top: activeElement.offsetTop });
        }
    }

    // When a sub dropdown menu is opened, force close any sibling sub dropdown menus
    private _subscribeToChildrenVisbilityToggle() {
        const openEvents: Observable<number>[] = this.nestedDropdowns
            .map((nd, index) => {
                return nd.opened
                    .pipe(map(x => index));
            });

        merge(...openEvents).pipe(
            takeUntil(this._destroyed$)
        ).subscribe(index => {
            // Close all other sibling dropdowns
            this.nestedDropdowns
                .filter((nd, i) => i !== index)
                .forEach(nd => nd.close());
        });
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this._shouldCloseOnMenuClick()) {
            return this._service.close();
        }
    }

    private _shouldCloseOnMenuClick(): boolean {
        return this._service.autoClose === true || this._service.autoClose === 'inside';
    }

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

}