import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AutoFocusDirective } from 'nw-style-guide/autofocus';
import { AppCodeComponent } from '../code/code.component';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-autofocus',
    templateUrl: './autofocus.component.html',
    styleUrls: ['./autofocus.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AutoFocusDirective, AppCodeComponent, CodeSandboxComponent]
})
export class AutofocusComponent {
    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { AutoFocusDirective } from 'nw-style-guide/autofocus';`
    };

    readonly exampleSnippet: ISnippet = {
        lang: 'html',
        code: `<input type="text" nwAutofocus class="form-control"
                placeholder="This input is autofocused on load">`
    };
}
