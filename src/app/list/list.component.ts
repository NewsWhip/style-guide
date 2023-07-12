import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DropdownMenuDirective } from '../../_lib/modules/dropdowns/dropdown-menu.directive';
import { DropdownToggleDirective } from '../../_lib/modules/dropdowns/dropdown-toggle.directive';
import { DropdownDirective } from '../../_lib/modules/dropdowns/dropdown.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare var html_beautify: any;
declare var $: any;

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, DropdownDirective, DropdownToggleDirective, DropdownMenuDirective]
})
export class ListComponent implements OnInit, AfterViewInit {

    @ViewChild('lg', { static: true }) lg: ElementRef;
    @ViewChild('lgPrimary', { static: true }) lgPrimary: ElementRef;
    @ViewChild('nestedLg', { static: true }) nestedLg: ElementRef;

    public listGroupHTML: string;
    public listGroupPrimaryHTML: string;
    public nestedLgHTML: string;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        $('[data-toggle="tooltip"]').tooltip();

        setTimeout(() => {
            this.listGroupHTML = html_beautify(this.lg.nativeElement.outerHTML);
            this.listGroupPrimaryHTML = html_beautify(this.lgPrimary.nativeElement.outerHTML);
            this.nestedLgHTML = html_beautify(this.nestedLg.nativeElement.outerHTML);
        }, 0);
    }

    escapeHtml(unsafe: string) {
        return unsafe
            .trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

}
