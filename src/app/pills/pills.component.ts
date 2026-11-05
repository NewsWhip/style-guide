import { Component } from '@angular/core';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-pills',
    templateUrl: './pills.component.html',
    imports: [CodeSandboxComponent]
})
export class DemoPillsComponent {
    public sizesSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="pill pill-sm">
            <span class="pill-label">Pill label (.pill-sm)</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-lg">
            <span class="pill-label">Pill label (.pill-lg)</span>
            <button class="close">&times;</button>
        </div>`
    };

    public statesSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="pill pill-sm selected">
            <span class="pill-label">Selected</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-sm">
            <span class="pill-label">Default</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-sm disabled">
            <span class="pill-label">Disabled</span>
            <button class="close" disabled>&times;</button>
        </div>

        <div class="pill pill-sm pill-excluded">
            <span class="pill-label">Excluded</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-sm pill-editable">
            <span class="pill-label">Editable</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-sm invalid">
            <span class="pill-label">Invalid</span>
            <button class="close">&times;</button>
        </div>

        <div class="pill pill-sm invalid selected">
            <span class="pill-label">Invalid & selected</span>
            <button class="close">&times;</button>
        </div>`
    };
}
