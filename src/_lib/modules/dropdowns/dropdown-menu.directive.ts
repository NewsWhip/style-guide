import { Directive, HostListener, QueryList, AfterContentInit, ContentChildren, OnDestroy } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { DropdownDirective } from "./dropdown.directive";
import { map } from "rxjs/operators";
import { Subscription, Observable, merge } from 'rxjs';

@Directive({
  selector: '[nwDropdownMenu]',
  exportAs: 'nw-dropdown-menu'
})
export class DropdownMenuDirective implements AfterContentInit, OnDestroy {

    @ContentChildren(DropdownDirective) nestedDropdowns: QueryList<DropdownDirective>;

    private _childrenVisibilityToggledSub: Subscription;

    constructor(private _service: DropdownService) {}

    ngAfterContentInit() {
        this._subscribeToChildrenVisbilityToggle();
    }

    // When a sub dropdown menu is opened, force close any sibling sub dropdown menus
    private _subscribeToChildrenVisbilityToggle() {
        const openEvents: Observable<number>[] = this.nestedDropdowns
            .map((nd, index) => {
                return nd.opened
                    .pipe(map(x => index))
            });

        this._childrenVisibilityToggledSub = merge(...openEvents)
            .subscribe(index => {
                // Close all other sibling dropdowns
                this.nestedDropdowns
                    .filter((nd, i) => i !== index)
                    .forEach(nd => nd.close());
            })
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
        this._childrenVisibilityToggledSub.unsubscribe();
    }

}
