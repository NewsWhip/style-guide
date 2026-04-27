import { Component, ChangeDetectionStrategy } from '@angular/core';
import { has, uniqueId } from 'lodash-es';
import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            nw-tabs {
                display: block;
                margin-bottom: 32px;
            }
        `
    ],
    imports: [TABS_DIRECTIVES]
})
export class TabsComponent {
    public tabCollection = [
        { name: 'Home', isActive: true, hasDropdown: false },
        { name: 'About', isActive: false, hasDropdown: true },
        { name: 'Careers', isActive: false, hasDropdown: true },
        { name: 'Contact', isActive: false, hasDropdown: false },
        { name: 'Travel', isActive: false, hasDropdown: true }
    ];

    setSelectedTab(selectedTab: { name: string }) {
        this.tabCollection.forEach(tab => {
            tab.isActive = tab.name === selectedTab.name;
        });
    }

    addTab(): void {
        this.tabCollection.push({
            name: uniqueId('Added '),
            isActive: false,
            hasDropdown: false
        });
    }

    removeLastTab(): void {
        const index = this.tabCollection.length - 1;
        this.tabCollection.splice(index, 1);
    }
}
