import { Component } from '@angular/core';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-labels',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.scss'],
    imports: [CodeSandboxComponent]
})
export class LabelsComponent {
    public standardSnippet: ISnippet = {
        lang: 'html',
        code: `<span class="label">Default</span>
<span class="label label-danger">Danger</span>
<span class="label label-alt">Alt</span>
<span class="label label-op">Overperforming</span>`
    };

    public roundSnippet: ISnippet = {
        lang: 'html',
        code: `<span class="label label-round label-new">New</span>
<span class="label label-round label-beta">Beta</span>
<span class="label label-round label-badge">Badge</span>
<span class="label label-round label-alt-badge">Alt Badge</span>`
    };
}
