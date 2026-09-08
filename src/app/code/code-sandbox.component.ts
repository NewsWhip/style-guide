import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';
import { AppCodeComponent } from './code.component';
import { ISnippet } from './ISnippet';

@Component({
    selector: 'app-code-sandbox',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [AppCodeComponent],
    template: `
        <div
            class="code-sandbox"
            [class.code-sandbox--horizontal]="layout() === 'horizontal'">
            <div
                class="code-sandbox__preview"
                [class.code-sandbox__preview--dark]="darkBg">
                <button
                    class="code-sandbox__bg-toggle"
                    [class.code-sandbox__bg-toggle--active]="darkBg"
                    (click)="darkBg = !darkBg">
                    <i class="fas fa-adjust"></i>
                </button>
                <ng-content></ng-content>
            </div>
            <div class="code-sandbox__code">
                <app-code [snippet]="snippet()"></app-code>
            </div>
        </div>
    `,
    styleUrls: ['./code-sandbox.component.scss']
})
export class CodeSandboxComponent {
    snippet = input.required<ISnippet>();
    layout = input<'vertical' | 'horizontal'>('vertical');

    darkBg = true;
}
