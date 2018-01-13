import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

declare var html_beautify: any;

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, AfterViewInit {

    @ViewChild('lg') lg: ElementRef;
    @ViewChild('lgPrimary') lgPrimary: ElementRef;
    @ViewChild('nestedLg') nestedLg: ElementRef;

    public listGroupHTML: string;
    public listGroupPrimaryHTML: string;
    public nestedLgHTML: string;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        console.log(this.lg);

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
