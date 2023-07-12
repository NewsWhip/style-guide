import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TabsService } from './tabs.service';

@Directive({
    selector: '[nwTab]',
    standalone: true
})
export class TabDirective implements OnChanges {

    @HostBinding('class.active') @Input() isActive: boolean = false;

    constructor(
        public elRef: ElementRef<HTMLElement>,
        private _tabsService: TabsService) {}

    ngOnChanges(changes: SimpleChanges) {
        const hasChanged = changes.isActive &&
            changes.isActive.previousValue !== changes.isActive.currentValue &&
            !changes.isActive.firstChange;

        if (hasChanged && this.isActive) {
            this._tabsService.notifyActiveChange(this);
        }
    }
}
