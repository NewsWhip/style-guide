import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CAROUSEL_DIRECTIVES } from 'nw-style-guide/carousel';
import { AppCodeComponent } from '../code/code.component';
import { CodeSandboxComponent } from '../code/code-sandbox.component';
import { ISnippet } from '../code/ISnippet';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CAROUSEL_DIRECTIVES, AppCodeComponent, CodeSandboxComponent]
})
export class CarouselComponent implements OnInit {
    public items: any[] = [];
    public numItems: number = 30;

    ngOnInit() {
        this.items = [...Array(this.numItems).fill(1)].map((_, i) => i);
    }

    readonly importSnippet: ISnippet = {
        lang: 'typescript',
        code: `import { CarouselModule } from 'nw-style-guide/carousel';`
    };

    readonly defaultExampleSnippet: ISnippet = {
        lang: 'html',
        code: `<nw-carousel maskColor="#373737">
            @for (item of items; track item) {
                <div class="slide"
                    nwCarouselSlide
                    snapAlign="center"
                    [style.background-image]="'url(https://picsum.photos/216/120?image=' + item + ')'">
                    Slide {{ item }}
                </div>
            }
        </nw-carousel>`
    };

    readonly customPaginationSnippet: ISnippet = {
        lang: 'html',
        code: `<nw-carousel maskColor="#373737" #carousel="nw-carousel"
            [showPageIndicator]="false" [showPagination]="false">
            @for (item of items; track item) {
                <div class="slide" nwCarouselSlide
                    [style.background-color]="'grey'">
                    Slide {{ item }}
                </div>
            }

            <div class="pagination-left">
                <button class="btn btn-primary btn-md" (click)="carousel.prev()">Prev</button>
            </div>

            <div class="pagination-right">
                <button class="btn btn-primary btn-md" (click)="carousel.next()">Next</button>
            </div>

            <div class="pagination-indicators" style="width: 100%; text-align: center">
                @for (page of carousel.getPages(); track page) {
                    <button class="btn sm btn-primary"
                        [class.active]="page === carousel.currPage"
                        (click)="carousel.goToPage(page)">
                        {{ page + 1 }}
                    </button>
                }
            </div>
        </nw-carousel>`
    };
}
