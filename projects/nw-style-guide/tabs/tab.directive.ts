import { AfterContentInit, Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TabsService } from './tabs.service';

@Directive({ selector: '[nwTab]' })
export class TabDirective implements OnChanges, AfterContentInit {
    readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _tabsService = inject(TabsService);

    @HostBinding('class.active') @Input() isActive: boolean = false;
    @HostBinding('attr.role') readonly role = 'tab';
    @HostBinding('attr.aria-selected') get ariaSelected() { return String(this.isActive); }

    ngAfterContentInit() {
        // <li role="tab"> is the keyboard target; inner tab button is click-only
        this.elRef.nativeElement.querySelector<HTMLButtonElement>('button')?.setAttribute('tabindex', '-1');
        this._applyTabindex(this.isActive ? '0' : '-1');
    }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes.isActive;
        const hasActiveChanged = change && !change.firstChange && change.previousValue !== change.currentValue;
        if (!hasActiveChanged) return;

        this._applyTabindex(this.isActive ? '0' : '-1');
        if (this.isActive) {
            this._tabsService.notifyActiveChange(this);
        }
    }

    focus() {
        this.elRef.nativeElement.focus();
    }

    setTabindex(value: string) {
        this._applyTabindex(value);
    }

    restoreTabindex() {
        this._applyTabindex(this.isActive ? '0' : '-1');
    }

    private _applyTabindex(value: string) {
        this.elRef.nativeElement.setAttribute('tabindex', value);
        this._actionButton()?.setAttribute('tabindex', value);
    }

    private _actionButton(): HTMLButtonElement | null {
        const btns = this.elRef.nativeElement.querySelectorAll<HTMLButtonElement>('button');
        return btns.length > 1 ? btns[1] : null;
    }
}
