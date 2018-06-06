import { Component, ContentChildren, QueryList, Input } from '@angular/core';
import { TabDirective } from './tab.directive';

@Component({
    selector: 'nw-tabs',
    template: `
      <ul class="nav nav-tabs" [ngClass]="tabSizeClass" role="tablist">
          <ng-content></ng-content>
      </ul>
      <div #border class="nav-tabs-active-bar" [ngStyle]="getStyles()"></div>
  `,
    styles: [`
        :host, ul {
            position: relative;
        }
  `]
})

export class TabsComponent {

    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    @ContentChildren(TabDirective) tabs: QueryList<TabDirective> = new QueryList();

    getActiveTab(): TabDirective {
        return this.tabs.filter(t => t.isActive)[0];
    }

    get tabSizeClass(): string {
        return `nav-${this.size}`;
    }

    getStyles(): Object {
        const tab: TabDirective = this.getActiveTab();
        if (tab) {
            return {
                width: tab.elRef.nativeElement.getBoundingClientRect().width + 'px',
                left: tab.elRef.nativeElement.offsetLeft + 'px'
            };
        }
        return {};
    }
}
