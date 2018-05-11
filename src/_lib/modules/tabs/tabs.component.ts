import { Component, ContentChildren, QueryList } from '@angular/core';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'nw-tabs',
  template: `
      <ul class="nav nav-tabs" role="tablist">
          <ng-content></ng-content>
      </ul>
      <div #border class="nav-tabs-active-bar" [ngStyle]="getStyles()"></div>
  `
})

export class TabsComponent {

  @ContentChildren(TabDirective) tabs: QueryList<TabDirective> = new QueryList();

  getActiveTab(): TabDirective {
      return this.tabs.filter(t => t.isActive)[0];
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
