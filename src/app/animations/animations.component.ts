import { Component } from '@angular/core';
import { NW_DURATION, NW_EASING } from 'nw-style-guide/animations';
import { AppCodeComponent } from '../code/code.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-animations',
    templateUrl: './animations.component.html',
    styleUrls: ['./animations.component.scss'],
    imports: [AppCodeComponent]
})
export class AnimationsComponent {
    public duration = NW_DURATION;
    public easing = NW_EASING;
    public fadeInSnippet: ISnippet = {
        lang: 'html',
        code: `<div
            class="dashboard-item"
            animate.enter="fade-in">
        </div>`
    };

    public fadeOutSnippet: ISnippet = {
        lang: 'html',
        code: `<div
            class="dashboard-item"
            animate.leave="fade-out">
        </div>`
    };

    public gridSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="collapse-expand-grid-container"
            animate.enter="grid-expand"
            animate.leave="grid-collapse">
            <div class="collapse-expand-grid-item">
                <!-- your content here -->
            </div>
        </div>`
    };
}
