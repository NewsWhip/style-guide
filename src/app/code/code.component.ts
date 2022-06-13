import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ISnippet } from './ISnippet';
import * as prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';

@Component({
    selector: 'app-code',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <pre class="language-{{snippet.lang}}">
            <code #code class="language-{{snippet.lang}}"></code>
        </pre>
    `
})
export class AppCodeComponent implements AfterViewInit {

    @ViewChild('code', { static: true }) codeEl: ElementRef<HTMLElement>;

    @Input() snippet: ISnippet;

    ngAfterViewInit() {
        this.codeEl.nativeElement.textContent = this.snippet.code;
        prism.highlightElement(this.codeEl.nativeElement);
    }
}