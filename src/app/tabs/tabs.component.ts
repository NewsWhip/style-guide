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

  public selectedTab = "Home";

  constructor() { }

  ngOnInit() {
  }

}
