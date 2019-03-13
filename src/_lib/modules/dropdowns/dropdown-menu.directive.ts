import { Directive, Input, HostListener, QueryList, OnInit, AfterContentInit, ContentChildren, OnDestroy } from '@angular/core';
import { DropdownService } from "./dropdown.service";
import { DropdownDirective } from "./dropdown.directive";
import { Subscription } from "rxjs/Subscription";
import { combineLatest } from "rxjs/observable/combineLatest";
import { startWith, timestamp, map, filter } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

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
    //
    private _subscribeToChildrenVisbilityToggle() {
        //
        // With combineLatest we don't know what observable caused
        // our subscribe to trigger.
        //
        // To get around this we're mapping each open event to a timestamp
        // and then finding the most recent timestamp to identify which
        // DropdownDirective triggered the subscribe.
        //
        // https://stackoverflow.com/a/48832719
        //
        const openEvents: Observable<number>[] = this.nestedDropdowns
            .map(nd => {
                return nd.opened
                    .pipe(
                        timestamp(),
                        map(t => t.timestamp),
                        startWith(null)
                    );
            });

        this._childrenVisibilityToggledSub = combineLatest(...openEvents)
            .pipe(
                // Don't emit values if every item in the response is falsy
                filter(res => res.some(item => Boolean(item))),
                // Map the timestamp to the dropdown index
                map(timestamps => timestamps.indexOf(Math.max(...timestamps)))
            )
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
