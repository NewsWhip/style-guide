import { Component, OnInit, ChangeDetectionStrategy, Input, ContentChildren, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { CarouselSlideDirective } from './carousel-slide.directive';

@Component({
    selector: 'nw-carousel',
    template: `
        <div class="nw-carousel">
            <div class="scroll-container">
                <div class="page-container" *ngFor="let page of pages" ngClass="page-container-{{page}} {{pageContainerClass}}">
                    <div *ngFor="let item of slides.toArray() | slice:getSlideIndicesByPage(page)[0]:getSlideIndicesByPage(page)[1] + 1"
                        class="slide-container"
                        [ngClass]="slideContainerClass"
                        #slideEls>
                        <ng-container [ngTemplateOutlet]="item.templateRef"></ng-container>
                    </div>
                </div>
            </div>
        </div>

        <div class="pagination-container">
            <button class="btn btn-lg btn-primary" (click)="next()" *ngIf="currPage !== (maxPage - 1)">&gt;</button>
        </div>

        <div class="pagination-container">
            <button class="btn btn-lg btn-primary" (click)="prev()" *ngIf="currPage !== 0">&lt;</button>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'nw-carousel',
    styles: [`
        .nw-carousel {
            position: relative;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
        }
        .page-container {
            display: inline-block;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            border: 1px dashed black;
            position: relative;
        }
        .slide-container {
            display: inline-block;
        }
        .pagination-container {
            width: 50px;
            position: relative;
            top: 400px;
        }
        >>> .my-page-container {

        }
        >>> .my-slide-container {

        }
    `]
})
export class CarouselComponent implements OnInit, AfterViewInit {

    @Input() currPage: number = 0;
    @Input() itemsPerPage: number;
    @Input() totalNumItems: number;
    @Input() showDots: boolean = true;
    @Input() pageContainerClass: string;
    @Input() slideContainerClass: string;

    @ContentChildren(CarouselSlideDirective) slides: QueryList<CarouselSlideDirective>;

    @ViewChildren('slideEls') slideEls: QueryList<ElementRef>;

    public state: string = '';
    public pages: number[];

    ngOnInit() {
        this.pages = [...Array(this.maxPage).fill(0)].map((_, i) => i)
    }

    ngAfterViewInit() {
        this.scrollActiveSlideIntoView();
    }

    getSlideIndicesByPage(page: number): [number, number] {
        const firstSlideIndex: number = page * this.itemsPerPage;

        return [firstSlideIndex, Math.min(firstSlideIndex + this.itemsPerPage - 1, this.totalNumItems - 1)]
    }

    scrollActiveSlideIntoView() {
        let slideToScrollTo = this.state === 'next' ?
            this.slideEls.toArray()[this.getSlideIndicesByPage(this.currPage)[1]] :
            this.slideEls.toArray()[this.getSlideIndicesByPage(this.currPage)[0]];

        slideToScrollTo.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }

    next() {
        this.state = 'next';
        this.currPage++;
        this.scrollActiveSlideIntoView();

        console.log('Next:', this.getSlideIndicesByPage(this.currPage))
    }

    prev() {
        this.state = 'previous';
        this.currPage--;
        this.scrollActiveSlideIntoView();

        console.log('Prev:', this.getSlideIndicesByPage(this.currPage))
    }

    get maxPage(): number {
        return Math.ceil(this.totalNumItems / this.itemsPerPage);
    }

    onAnimDone(ev) {
        console.log(ev);
    }

}
