import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dropdowns',
    templateUrl: './dropdowns.component.html',
    styleUrls: ['./dropdowns.component.scss']
})
export class DropdownsComponent implements OnInit {

    public popoverExample: string;

    public dropdownItems = [...new Array(30).fill(0).map((_, i) => ({key: i, value: `option ${i}`}))];
    public selectedItem: {key: number, value: string} = this.dropdownItems[20];
    public preselectedExample: string;
    
    constructor() { }

    ngOnInit() {
        this.popoverExample = this.getPopoverExample();
    }

    stopProp(e: Event) {
        e.preventDefault();
    }


    getPopoverExample(): string {
        return `
<div class="dropdown">
        <button class="btn btn-md btn-secondary"
            [nwPopover]="dropdownMenuRef"
            containerClass="popover-dropdown"
            placement="bottom-start"
            [closeOnOutsideClick]="true"
            [withArrow]="false">
            Append to body
        </button>
    </div>

    <ng-template #dropdownMenuRef>
        <div class="dropdown-menu" cdkMenu>
            <button cdkMenuItem class="menu-item">Menu item 1</button>
            <button cdkMenuItem class="menu-item">Menu item 2</button>
            <button cdkMenuItem class="menu-item">Menu item 3</button>
            <button cdkMenuItem class="menu-item">Menu item 4</button>
            <button cdkMenuItem class="menu-item" [cdkMenuTriggerFor]="nestedDropdown" nwDropdownToggle nwTrigger="hover">
                Nested dropdown<i class="fas fa-caret-right pull-right"></i>
            </button>
            <ng-template #nestedDropdown>
                <div class="dropdown-menu" cdkMenu>
                    <button cdkMenuItem class="menu-item">Nested Dropdown Item 1</button>
                    <button cdkMenuItem class="menu-item">Nested Dropdown Item 2</button>
                    <button cdkMenuItem class="menu-item">Nested Dropdown Item 3</button>
                    <button cdkMenuItem class="menu-item">Nested Dropdown Item 4</button>
                    <hr class="divider" role="separator"/>
                    <button cdkMenuItem class="menu-item">Separated item</button>
                </div>
            </ng-template>
        </div>
    </ng-template>
        `
    }
}
