import { Component, AfterViewInit, ViewChild, ElementRef, WritableSignal, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import beautify from 'js-beautify';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, CdkMenuModule, RouterLinkActive]
})
export class ListComponent implements OnInit, AfterViewInit {

    @ViewChild('lg', { static: true }) lg: ElementRef;
    @ViewChild('lgPrimary', { static: true }) lgPrimary: ElementRef;
    @ViewChild('nestedLg', { static: true }) nestedLg: ElementRef;

    public listGroupHTML: WritableSignal<string> = signal('');
    public listGroupPrimaryHTML: WritableSignal<string> = signal('');
    public nestedLgHTML: WritableSignal<string> = signal('');

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.listGroupHTML.set(beautify.html(this.lg.nativeElement.outerHTML));
            this.listGroupPrimaryHTML.set(beautify.html(this.lgPrimary.nativeElement.outerHTML));
            this.nestedLgHTML.set(beautify.html(this.nestedLg.nativeElement.outerHTML));
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
