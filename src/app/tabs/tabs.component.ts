import { Component } from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

    public navTabs = [
        'Home',
        'Profile',
        'Messages',
        'Settings'
    ];
    public tabCollection = [
        {
            name: 'Home',
            isActive: true
        },
        {
            name: 'About',
            isActive: false
        },
        {
            name: 'Careers',
            isActive: false
        },
        {
            name: 'Contact',
            isActive: false
        },
        {
            name: 'Travel',
            isActive: false
        }
    ];

    setSelectedTab(selectedTab: any) {
        this.tabCollection.forEach(tab => {
            tab.isActive = tab.name === selectedTab.name;
        });
    }
}
