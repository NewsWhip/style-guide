import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkMenuModule } from '@angular/cdk/menu';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss'],
    imports: [FormsModule, CodeSandboxComponent, CdkMenuModule]
})
export class ButtonsComponent {
    public sizes = ['xs', 'sm', 'md', 'lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt', 'activate'];
    public defaultBtnSize: string = 'lg';
    public btnGroupSize: string = '50%';

    public variationsSnippet: ISnippet = {
        lang: 'html',
        code: `<button class="btn btn-primary btn-lg btn-block">.btn-block</button>
            <button class="btn btn-primary btn-lg btn-round"><i class="fas fa-plus"></i></button>
            <button class="btn btn-primary btn-lg btn-close"></button>
            <button class="btn btn-primary btn-lg"><i class="fab fa-facebook btn-icon"></i> With icon</button>
            <button class="btn btn-primary btn-lg btn-no-padding">No padding</button>
            <button class="btn btn-carousel btn-carousel-prev"></button>
            <button class="btn btn-carousel"></button>
            <button class="btn btn-link">.btn-link</button>`
    };

    public statesSnippet: ISnippet = {
        lang: 'html',
        code: `<button class="btn btn-primary btn-lg disabled" disabled>.disabled</button>
            <button class="btn btn-primary btn-lg active">.active</button>`
    };

    public btnGroupGhostSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="btn-group" role="group">
            <button type="button" class="btn btn-ghost btn-md">Button 1</button>
            <button type="button" class="btn btn-ghost btn-md" disabled>Button 2 disabled</button>
            <button type="button" class="btn btn-ghost btn-md">Button 3</button>
            <button type="button" class="btn btn-ghost btn-md"><i class="fas fa-ellipsis-v"></i></button>
        </div>`
    };

    public btnGroupSecondarySnippet: ISnippet = {
        lang: 'html',
        code: `<div class="btn-group" role="group">
            <button type="button" class="btn btn-secondary btn-lg">Button 1</button>
            <button type="button" class="btn btn-secondary active btn-lg">Button 2 active</button>
            <button type="button" class="btn btn-secondary btn-lg">Button 3</button>
            <button type="button" class="btn btn-secondary btn-lg" disabled>Button 4 disabled</button>
        </div>`
    };

    public btnGroupPrimarySnippet: ISnippet = {
        lang: 'html',
        code: `<div class="btn-group" role="group">
            <button type="button" class="btn btn-primary btn-lg">Button 1</button>
            <button type="button" class="btn btn-primary active btn-lg">Button 2 active</button>
            <button type="button" class="btn btn-primary btn-lg">Button 3</button>
            <button type="button" class="btn btn-primary btn-lg" disabled>Button 4 disabled</button>
        </div>`
    };

    public btnGroupResponsiveSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="btn-group btn-group-responsive btn-group-responsive-md" role="group">
            <button type="button" class="btn btn-secondary"><i class="fas fa-adjust"></i></button>
            <button type="button" class="btn btn-secondary"><i class="far fa-bell"></i></button>
            <button type="button" class="btn btn-secondary"><i class="fas fa-sliders-h"></i></button>
            <button type="button" class="btn btn-secondary"><i class="far fa-star"></i></button>
            <button type="button" class="btn btn-secondary"><i class="far fa-bookmark"></i></button>
        </div>`
    };

    public btnGroupGhostAltSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="btn-group" role="group">
            <button type="button" class="btn btn-ghost-alt btn-lg"><i class="fas fa-adjust"></i></button>
            <button type="button" class="btn btn-ghost-alt btn-lg"><i class="far fa-bell"></i></button>
            <button type="button" class="btn btn-ghost-alt btn-lg"><i class="fas fa-sliders-h"></i></button>
            <button type="button" class="btn btn-ghost-alt btn-lg" disabled><i class="far fa-star"></i></button>
            <div class="btn-group" role="group">
                <button class="btn btn-ghost-alt btn-lg" type="button">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        </div>`
    };
}
