import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

declare var html_beautify: any;

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
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
