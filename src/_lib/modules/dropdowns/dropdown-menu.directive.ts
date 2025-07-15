import { Directive, HostListener, QueryList, AfterContentInit, ContentChildren, OnDestroy, ElementRef } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { DropdownDirective } from "./dropdown.directive";
import { Subject } from 'rxjs';

@Directive({
    selector: '[nwDropdownMenu]',
    exportAs: 'nw-dropdown-menu'
})
export class DropdownMenuDirective implements AfterContentInit, OnDestroy {

    @ContentChildren(DropdownDirective) nestedDropdowns: QueryList<DropdownDirective>;
    private _destroyed$: Subject<void> = new Subject();

    constructor(
        private _service: DropdownService,
        private _element: ElementRef<HTMLElement>
    ) { }

    ngAfterContentInit() {
        this._scrollToActiveElement();
    }

    private _scrollToActiveElement() {
        const menuElement = this._element.nativeElement;

        const activeItem = menuElement.querySelector('.menu-item.active') as HTMLElement | null;
        if (activeItem) {
            setTimeout(() => {
                menuElement.scrollTo({ top: activeItem.offsetTop });
            });
        }
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