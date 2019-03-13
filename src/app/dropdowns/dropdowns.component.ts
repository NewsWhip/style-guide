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
        return `<div class="dropdown" nwDropdown>
    <button class="btn btn-dropdown dropdown-toggle" type="button" id="dropdownNestedMenu1" nwDropdownToggle>
        Right aligned
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" nwDropdownMenu aria-labelledby="dropdownNestedMenu1">
        <li><a href="javascript:;">Action</a></li>
        <li><a href="javascript:;">Another action</a></li>
        <li class="dropdown-submenu" nwDropdown nwDropdownToggle nwTrigger="hover">
            <a href="javascript:;">Nested 1<i class="fas fa-caret-right pull-right"></i></a>

            <ul class="dropdown-menu" nwDropdownMenu>
                <li><a href="javascript:;">Nested Dropdown Item 1</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 2</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 3</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 4</a></li>

                <li class="divider" role="separator"></li>
                <li><a href="javascript:;"><span>Separated item</span></a></li>
            </ul>
        </li>
        <li class="dropdown-submenu" nwDropdown nwDropdownToggle nwTrigger="hover">
            <a href="javascript:;">Nested 2<i class="fas fa-caret-right pull-right"></i></a>

            <ul class="dropdown-menu" nwDropdownMenu>
                <li><a href="javascript:;">Nested Dropdown Item 1</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 2</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 3</a></li>
                <li><a href="javascript:;">Nested Dropdown Item 4</a></li>

                <li class="divider" role="separator"></li>
                <li class="dropdown-submenu" nwDropdown nwDropdownToggle nwTrigger="hover">
                    <a href="javascript:;">Nested again<i class="fas fa-caret-right pull-right"></i></a>

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
        </li>
        <li><a href="javascript:;">Something else here</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="javascript:;">Separated link</a></li>
    </ul>
</div>`
    }
}
