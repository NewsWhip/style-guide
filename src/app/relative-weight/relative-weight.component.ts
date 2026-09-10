import { Component } from '@angular/core';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-relative-weight',
    templateUrl: './relative-weight.component.html',
    styleUrls: ['./relative-weight.component.scss'],
    imports: [CodeSandboxComponent]
})
export class RelativeWeightComponent {
    public scores: number[] = [76, 65, 87, 12, 32, 45];

    public defaultSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="rel-weight">
            <div class="rel-weight-bar" [style.width]="getWeight(score) + '%'">
                {{ score }}
            </div>
        </div>`
    };

    public sizesSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="rel-weight">
                <div class="rel-weight-bar" style="width: 33%">33</div>
            </div>

            <div class="rel-weight rel-weight-sm">
                <div class="rel-weight-bar" style="width: 52%">52</div>
            </div>

            <div class="rel-weight rel-weight-lg">
                <div class="rel-weight-bar" style="width: 13%">13</div>
            </div>`
    };

    getWeight(score: number) {
        return Math.round((score / this.max) * 100);
    }

    get max(): number {
        return this.scores.reduce((a, b) => Math.max(a, b));
    }
}
