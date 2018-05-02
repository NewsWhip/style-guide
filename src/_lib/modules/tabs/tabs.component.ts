import { Component, ContentChildren, QueryList } from '@angular/core';
import { TabDirective } from './tab.directive';

@Component({
  selector: 'nw-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
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
            left: tab.elRef.nativeElement.getBoundingClientRect().left + 'px'
        };
      }
      return {};
  }
}
