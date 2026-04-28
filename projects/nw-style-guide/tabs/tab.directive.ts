import { AfterContentInit, Directive, ElementRef, effect, input, inject } from '@angular/core';
import { TabsService } from './tabs.service';

@Directive({
    selector: '[nwTab]',
    host: {
        role: 'tab',
        '[class.active]': 'isActive()',
        '[attr.aria-selected]': 'isActive()'
    }
})
export class TabDirective implements AfterContentInit {
    readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _tabsService = inject(TabsService);

    isActive = input<boolean>(false);

    constructor() {
        effect(() => {
            this._applyTabindex(this.isActive() ? '0' : '-1');
            if (this.isActive()) {
                this._tabsService.notifyActiveChange(this);
            }
        });
    }

    ngAfterContentInit() {
        // <li role="tab"> is the keyboard target; inner tab button is click-only
        this.elRef.nativeElement.querySelector<HTMLButtonElement>('button')?.setAttribute('tabindex', '-1');
    }

    activate() {
        this.elRef.nativeElement.querySelector<HTMLButtonElement>('button:not(.btn)')?.click();
    }

    focus() {
        this.elRef.nativeElement.focus();
    }

    setTabindex(value: string) {
        this._applyTabindex(value);
    }

    restoreTabindex() {
        this._applyTabindex(this.isActive() ? '0' : '-1');
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
