import { Component, AfterViewInit, ViewChild, ElementRef, WritableSignal, signal, ChangeDetectionStrategy } from '@angular/core';
import beautify from 'js-beautify';

@Component({
    selector: 'nw-app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ListComponent implements AfterViewInit {

    @ViewChild('lg', { static: true }) lg: ElementRef;
    @ViewChild('lgPrimary', { static: true }) lgPrimary: ElementRef;
    @ViewChild('nestedLg', { static: true }) nestedLg: ElementRef;

    public listGroupHTML: WritableSignal<string> = signal('');
    public listGroupPrimaryHTML: WritableSignal<string> = signal('');
    public nestedLgHTML: WritableSignal<string> = signal('');

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
