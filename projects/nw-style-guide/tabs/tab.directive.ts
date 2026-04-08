import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TabsService } from './tabs.service';

@Directive({ selector: '[nwTab]' })
export class TabDirective implements OnChanges {
    elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _tabsService = inject(TabsService);


    @HostBinding('class.active') @Input() isActive: boolean = false;
    @HostBinding('attr.role') role = 'tab';

    ngOnChanges(changes: SimpleChanges) {
        const hasChanged = changes.isActive &&
            changes.isActive.previousValue !== changes.isActive.currentValue &&
            !changes.isActive.firstChange;

        if (hasChanged && this.isActive) {
            this._tabsService.notifyActiveChange(this);
        }
    }
}
