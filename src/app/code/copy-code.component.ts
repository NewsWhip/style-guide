import { Component, ElementRef, ViewChild, AfterContentInit, ChangeDetectionStrategy, ContentChild } from "@angular/core";
import * as Clipboard from 'clipboard';
import { Toaster } from "../../_lib/modules/toasts";

@Component({
    selector: 'app-copy-code',
    template: `
        <pre><code #code><ng-content></ng-content></code><i class="fal fa-copy copy-icon" #copyIcon></i></pre>
    `,
    styles: [`
        .copy-icon {
            position: absolute;
            top: 4px;
            right: 4px;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CopyCodeComponent implements AfterContentInit {

    @ViewChild('copyIcon', { static: true }) copyIcon: ElementRef<HTMLElement>;
    @ViewChild('code', { static: true }) code: ElementRef<HTMLElement>;

    private _clipboard: Clipboard;

    constructor(private _toaster: Toaster) {}

    ngAfterContentInit() {
		this.initializeClipboard();
	}

	initializeClipboard() {
		this._clipboard = new Clipboard(this.copyIcon.nativeElement, {
		    text: () => {
		    	return this.code.nativeElement.innerText.trim();
		    }
        });

		this._clipboard.on('success', e => this._toaster.success('Copied to clipboard'));
		this._clipboard.on('error', e => this._toaster.error('Failed to copy'));
	}

	ngOnDestroy() {
		this._clipboard.destroy();
	}

}
