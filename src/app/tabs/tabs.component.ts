import { Component, ChangeDetectionStrategy } from '@angular/core';
import { uniqueId } from 'lodash-es';
import { TabDirective } from '../../_lib/modules/tabs/tab.directive';
import { NgFor } from '@angular/common';
import { TabsComponent as TabsComponent_1 } from '../../_lib/modules/tabs/tabs.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        nw-tabs {
            display: block;
            margin-bottom: 32px;
        }
    `],
    standalone: true,
    imports: [TabsComponent_1, NgFor, TabDirective]
})
export class TabsComponent {
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

    setSelectedTab(selectedTab) {
        this.tabCollection.forEach(tab => {
            tab.isActive = tab.name === selectedTab.name;
        });
    }

    addTab(): void {
        this.tabCollection.push({
            name: uniqueId('Added '),
            isActive: false
        })
    }

    removeLastTab(): void {
        const index = this.tabCollection.length - 1;
        this.tabCollection.splice(index, 1);
    }
}
