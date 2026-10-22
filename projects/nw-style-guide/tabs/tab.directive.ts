import { _IdGenerator } from '@angular/cdk/a11y';
import { AfterContentInit, Directive, ElementRef, effect, input, inject } from '@angular/core';
import { TabsService } from './tabs.service';

@Directive({
    selector: '[nwTab]',
    host: {
        '[class.active]': 'isActive()'
    }
})
export class TabDirective implements AfterContentInit {
    readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private _tabsService = inject(TabsService);
    private _idGenerator = inject(_IdGenerator);

    isActive = input<boolean>(false);

    /**
     * The element that is the tab as far as assistive technology is concerned, and that takes focus: the
     * `nwTabLabel` where there is one, otherwise the host itself.
     *
     * With a label, the host `li` is only presentational and the label is the `role="tab"`. That is what lets an
     * action button sit beside the label rather than inside the tab, as axe fails any focusable descendant of a
     * `role="tab"` whatever its tabindex
     */
    get tabElement(): HTMLElement {
        return this.elRef.nativeElement.querySelector<HTMLElement>('[nwTabLabel]') ?? this.elRef.nativeElement;
    }

    /** Whether the tab is a `nwTabLabel` inside this host, as opposed to the host itself */
    get hasLabelTab(): boolean {
        return this.tabElement !== this.elRef.nativeElement;
    }

    /** An id for the tab element, generated if it has none, so that the tablist can own it with `aria-owns` */
    get tabId(): string {
        const tab = this.tabElement;

        if (!tab.id) {
            tab.id = this._idGenerator.getId('nw-tab-');
        }

        return tab.id;
    }

    constructor() {
        effect(() => {
            this._applyRoles();
            this._applyTabindex(this.isActive() ? '0' : '-1');
            if (this.isActive()) {
                this._tabsService.notifyActiveChange(this);
            }
        });
    }

    ngAfterContentInit() {
        // A label marked `nwTabLabel` is itself the tab. Without one the `li` is the tab and the inner label is
        // click-only: a focusable <button> inside role="tab" fails axe's nested-interactive rule even with
        // tabindex="-1", so the legacy <button> label is only kept click-only here rather than made compliant
        if (this.tabElement === this.elRef.nativeElement) {
            this.elRef.nativeElement
                .querySelector<HTMLButtonElement>('button:not(.btn)')
                ?.setAttribute('tabindex', '-1');
        }
    }

    activate() {
        this._label()?.click();
    }

    focus() {
        this.tabElement.focus();
    }

    setTabindex(value: string) {
        this._applyTabindex(value);
    }

    restoreTabindex() {
        this._applyTabindex(this.isActive() ? '0' : '-1');
    }

    private _applyRoles() {
        const host = this.elRef.nativeElement;
        const tab = this.tabElement;

        if (tab !== host) {
            host.setAttribute('role', 'presentation');
        }

        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(this.isActive()));
    }

    private _applyTabindex(value: string) {
        const tab = this.tabElement;

        tab.setAttribute('tabindex', value);
        // Beside the tab, the action button is a tab stop for the active tab, so that Tab reaches it and Enter opens
        // it. Inside the tab (no `nwTabLabel`) it can never be one, as a tabbable descendant of role="tab" fails
        // axe's nested-interactive rule
        this._actionButton()?.setAttribute('tabindex', tab === this.elRef.nativeElement ? '-1' : value);
    }

    private _actionButton(): HTMLButtonElement | null {
        const btns = this.elRef.nativeElement.querySelectorAll<HTMLButtonElement>('button');
        if (this._label()?.tagName !== 'BUTTON') {
            // non-button label: any button present is an action button
            return btns[0] ?? null;
        }
        return btns.length > 1 ? btns[1] : null;
    }

    private _label(): HTMLElement | null {
        return this.elRef.nativeElement.querySelector<HTMLElement>('[nwTabLabel], button:not(.btn)');
    }
}
