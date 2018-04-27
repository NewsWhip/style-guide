import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'nw-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})

export class TabsComponent implements OnInit {
  @Input() tabs: string[];
  activeTab: string;
  constructor() {}
  ngOnInit() {
      this.activeTab = this.tabs[0];
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
