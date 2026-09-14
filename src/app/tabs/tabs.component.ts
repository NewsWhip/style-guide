import { Component, ChangeDetectionStrategy } from '@angular/core';
import { uniqueId } from 'lodash-es';
import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';
import { AppCodeComponent } from '../code/code.component';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

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
    imports: [TABS_DIRECTIVES, AppCodeComponent, CodeSandboxComponent]
})
export class TabsComponent {
    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { TABS_DIRECTIVES } from 'nw-style-guide/tabs';`
    };

    readonly navPillsSnippet: ISnippet = {
        lang: 'html',
        code: `<ul class="nav nav-pills" role="tablist">
            <li role="presentation" class="active">
                <a role="tab">Tab 1 active</a>
            </li>
            <li role="presentation">
                <a role="tab">Tab 2</a>
            </li>
            <li role="presentation" class="disabled">
                <a role="tab">Tab disabled</a>
            </li>
        </ul>`
    };

    readonly navTabsSnippet: ISnippet = {
        lang: 'html',
        code: `<!-- size can be "sm", "md", or "lg" -->
            <nw-tabs size="md">
                @for (tab of tabs; track tab) {
                    <li nwTab [isActive]="tab.isActive">
                        <button (click)="setSelectedTab(tab)">
                            {{ tab.name }}
                        </button>
                    </li>
                }
            </nw-tabs>`
    };

    readonly navTabsDropdownSnippet: ISnippet = {
        lang: 'html',
        code: `<nw-tabs size="md">
                @for (tab of tabs; track tab) {
                    <li nwTab [isActive]="tab.isActive">
                        <button (click)="setSelectedTab(tab)">
                            {{ tab.name }}
                        </button>
                        @if (tab.hasDropdown) {
                            <button
                                class="btn btn-sm btn-ghost"
                                [attr.aria-label]="'Options for ' + tab.name">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        }
                    </li>
                }
            </nw-tabs>`
    };

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
