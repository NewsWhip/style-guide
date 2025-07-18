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
        container="body"
        containerClass="popover-dropdown"
        placement="left"
        [closeOnOutsideClick]="true">
        Append to body
    </button>
</div>

<ng-template #dropdownMenuRef>
    <!-- display block and custom positioning -->
    <ul class="dropdown-menu" style="display: block; top: 15px;">
        <li><a href="#">Menu item 1</a></li>
        <li><a href="#">Menu item 2</a></li>
        <li><a href="#">Menu item 3</a></li>
        <li><a href="#">Menu item 4</a></li>
        <ul class="dropdown-submenu" nwDropdown>
            <li nwDropdownToggle nwTrigger="hover">
                <a href="javascript:;">Nested dropdown<i class="fas fa-caret-right pull-right"></i></a>

                <ul class="dropdown-menu" nwDropdownMenu>
                    <li><a href="javascript:;">Nested Dropdown Item 1</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 2</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 3</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 4</a></li>

                    <li class="divider" role="separator"></li>
                    <li><a href="javascript:;"><span>Separated item</span></a></li>
                </ul>
            </li>
        </ul>
    </ul>
</ng-template>
        `
    }
}
