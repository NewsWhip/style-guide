import { CdkMenuModule } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [RouterLink, RouterLinkActive, CdkMenuModule, CodeSandboxComponent]
})
export class ListComponent {
    public listGroupSnippet: ISnippet = {
        lang: 'html',
        code: `<ul class="list-group">
    <h5 class="list-group-header">Default Menu</h5>

    <a href="#" class="list-group-item">Panel 1</a>
    <a href="#" class="list-group-item active">
        Panel 2 (active)
        <div class="list-group-item-actions">
            <a class="nw-link-inline" title="Example item icon">
                <i class="fas fa-info-circle"></i>
            </a>
        </div>
    </a>
    <a href="#" class="list-group-item">Panel 3</a>
    <a href="#" class="list-group-item">Panel 4 (w/ badge) <span class="label label-danger">New</span></a>
    <a href="#" class="list-group-item">Panel 5</a>
    <a class="list-group-item disabled">Panel 6 (disabled)</a>
    <a href="#" class="list-group-item">Panel 7</a>
    <div class="list-group-item-with-actions">
        <div class="dropdown list-group-item-actions">
            <button class="btn btn-ghost-alt" type="button">
                <i aria-hidden="true" class="fas fa-plus-circle"></i>
            </button>
        </div>
        <a class="list-group-item">Panel 8</a>
    </div>
</ul>`
    };

    public listGroupPrimarySnippet: ISnippet = {
        lang: 'html',
        code: `<div class="list-group list-group-primary">
                <h5 class="list-group-header">
                    Main Menu
                    <div class="list-group-header-actions">
                        <a class="nw-link-inline" title="Example header icon">
                            <i class="fas fa-info-circle"></i>
                        </a>
                    </div>
                </h5>

                <a class="list-group-item" routerLink="/" routerLinkActive="active">Home</a>
                <a class="list-group-item" routerLink="/buttons" routerLinkActive="active">Buttons</a>
                <a class="list-group-item" routerLink="/colors" routerLinkActive="active">Colors</a>
                <a class="list-group-item" routerLink="/interactive-text" routerLinkActive="active">Interactive text</a>
                <a class="list-group-item" routerLink="/dropdowns" routerLinkActive="active">Dropdowns</a>
                <a class="list-group-item" routerLink="/tabs" routerLinkActive="active">Tabs</a>
                <a class="list-group-item disabled">Branding (disabled)</a>
                <a class="list-group-item" routerLink="/lists" routerLinkActive="active">Lists</a>
            </div>`
    };

    public nestedLgSnippet: ISnippet = {
        lang: 'html',
        code: `<div class="list-group">
                <h5 class="list-group-header">
                    Collapse / expand menu
                    <div class="list-group-header-actions">
                        <div class="dropdown">
                            <button class="btn btn-ghost-alt" type="button">
                                <i aria-hidden="true" class="fas fa-plus-circle"></i>
                            </button>
                        </div>
                    </div>
                </h5>

                <a href="#" class="list-group-item">Item 1</a>

                <a href="#folder1" class="list-group-item collapsed active"
                    data-toggle="collapse" aria-expanded="false" aria-controls="folder1">Folder 1</a>
                <div class="collapse collapsible" id="folder1">
                    <a href="#" class="list-group-item">Item 2</a>
                </div>

                <div class="list-group-item-with-actions">
                    <div class="dropdown list-group-item-actions">
                        <button class="btn btn-ghost-alt" type="button">
                            <i class="far fa-ellipsis-v"></i>
                        </button>
                    </div>

                    <a href="#folder2" class="list-group-item collapsed"
                        data-toggle="collapse" aria-expanded="false" aria-controls="folder2">Folder 2</a>

                    <div class="collapse collapsible" id="folder2">
                        <a href="#" class="list-group-item">Item 3</a>
                        <a href="#" class="list-group-item">Item 4</a>
                        <a href="#" class="list-group-item">Item 5</a>

                        <a href="#folder3" class="list-group-item collapsed"
                            data-toggle="collapse" aria-expanded="false" aria-controls="folder3">Folder 3</a>

                        <div class="collapse collapsible" id="folder3">
                            <a href="#" class="list-group-item">Item 6</a>
                            <a href="#" class="list-group-item">Item 7</a>
                            <a href="#" class="list-group-item">Item 8</a>
                        </div>
                    </div>
                </div>
                <a href="#" class="list-group-item">Item 9</a>
                <a href="#" class="list-group-item">Item 10</a>
                <a class="list-group-item disabled">Item 11 (disabled)</a>
                <a href="#" class="list-group-item">Item 12</a>
            </div>`
    };
}
