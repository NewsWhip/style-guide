import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  public navTabs = [
    'Home',
    'Profile',
    'Messages',
    'Settings'
  ];
  public navTabsSecondary = [
      'Content 1',
      'Con rewgwre tent 2',
      'Content 3',
      'Con rg qwe tent 4',
      'Con rg qwe te qewfqwf efq eqwf'
  ];
  public secondarySelectedTab = 'Content 1';

  public selectedTab = 'Home';

  constructor() { }

  ngOnInit() {
  }

  animateLeftPos(): number {
      const elm: any = document.getElementById('tabs-control').getElementsByClassName('active')[0].getBoundingClientRect();
      return elm.left;
  }

  setWidth(): number {
      const elm: any = document.getElementById('tabs-control').getElementsByClassName('active')[0].getBoundingClientRect();
      return elm.width;
  }
}
