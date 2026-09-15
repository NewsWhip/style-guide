import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderComponent as NWLoaderComponent } from 'nw-style-guide/loader';
import { AppCodeComponent } from '../code/code.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [FormsModule, NWLoaderComponent, AppCodeComponent]
})
export class LoaderComponent {
    readonly exampleSnippet: ISnippet = {
        lang: 'html',
        code: `<nw-loader
                [isLoading]="true"
                [numOfDots]="6"
                [size]="'md'"></nw-loader>`
    };

    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { LoaderComponent } from 'nw-style-guide/loader';`
    };

    private _num: number = 6;
    public size: string = 'md';

    get num(): number {
        return this._num;
    }

    set num(value: number) {
        this._num = +value;
    }
}
