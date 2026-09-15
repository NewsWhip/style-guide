import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';
import { AppCodeComponent } from './code.component';
import { ISnippet } from './ISnippet';

@Component({
    selector: 'app-code-sandbox',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [AppCodeComponent],
    templateUrl: './code-sandbox.component.html',
    styleUrls: ['./code-sandbox.component.scss']
})
export class CodeSandboxComponent {
    snippet = input.required<ISnippet>();
    layout = input<'vertical' | 'horizontal'>('vertical');
}
