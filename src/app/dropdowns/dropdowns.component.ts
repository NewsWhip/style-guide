import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dropdowns',
    templateUrl: './dropdowns.component.html'
})
export class DropdownsComponent implements OnInit {

    public complexExample = this.getComplexExample();

    constructor() { }

    ngOnInit() {
    }

    stopProp(e: Event) {
        e.preventDefault();
    }

    getComplexExample() {
        return `<div class="dropdown" nwDropdown [autoClose]="false">
    <button class="btn btn-dropdown dropdown-toggle" type="button" id="dropdownNestedMenu1" nwDropdownToggle>
        Auto close false
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" nwDropdownMenu aria-labelledby="dropdownNestedMenu1">
        <li><a href="javascript:;">Action</a></li>
        <li><a href="javascript:;">Another action</a></li>

        <!-- Hover example -->
        <ul class="dropdown-submenu" nwDropdown>
            <li nwDropdownToggle nwTrigger="hover">
                <a href="javascript:;">Hover on me<i class="fas fa-caret-right pull-right"></i></a>

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
        <!-- Click example -->
        <ul class="dropdown-submenu" nwDropdown [autoClose]="'outside'">
            <li>
                <a href="javascript:;" nwDropdownToggle>Click me<i class="fas fa-caret-right pull-right"></i></a>

                <ul class="dropdown-menu" nwDropdownMenu>
                    <li><a href="javascript:;">This menu will close on a click outside it</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 1</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 2</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 3</a></li>
                    <li><a href="javascript:;">Nested Dropdown Item 4</a></li>

                    <li class="divider" role="separator"></li>
                    <li><a href="javascript:;"><span>Separated item</span></a></li>
                    <!-- Deeply nested -->
                    <ul class="dropdown-submenu" nwDropdown>
                        <li nwDropdownToggle nwTrigger="hover">
                            <a href="javascript:;">Hover on me<i class="fas fa-caret-right pull-right"></i></a>

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
            </li>
        </ul>
        <li><a href="javascript:;">Another action</a></li>
    </ul>
</div>`
    }
}
