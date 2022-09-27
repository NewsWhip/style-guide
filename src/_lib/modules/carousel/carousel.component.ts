import { Component, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, AfterViewInit, OnDestroy, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { trigger, transition, style, animate, AUTO_STYLE } from '@angular/animations';
import { debounceTime } from "rxjs/operators";
import { CarouselSlideDirective } from "./carousel-slide.directive";
import { Subscription, fromEvent } from 'rxjs';

@Component({
    selector: 'nw-carousel',
    template: `
        <div class="carousel-container">
            <div class="pagination-container" *ngIf="showPagination && !isFirstPage">
                <button class="btn btn-carousel btn-carousel-prev" (click)="prev()"></button>
            </div>

            <ng-content select=".pagination-left"></ng-content>

            <div class="carousel-content">
                <div class="pagination-masks" *ngIf="showMask && pages.length > 1">
                    <div class="pagination-mask pagination-mask-start" *ngIf="!isFirstPage" @collapse
                        [ngStyle]="maskStyles"></div>

                    <div class="pagination-mask pagination-mask-end" *ngIf="!isLastPage" @collapse
                        [ngStyle]="maskStyles"></div>
                </div>

                <div class="carousel" #carousel [ngClass]="containerClass">
                    <ng-content></ng-content>

                    <p *ngIf="slides.length === 0" class="nw-text text-center">{{noResultsText}}</p>
                </div>
            </div>

            <div class="pagination-container" *ngIf="showPagination && !isLastPage">
                <button class="btn btn-carousel btn-carousel-next" (click)="next()"></button>
            </div>

            <ng-content select=".pagination-right"></ng-content>
        </div>

        <div class="page-indicators" *ngIf="showPageIndicator && pages.length > 1">
            <a href="javascript:;" class="page-indicator" *ngFor="let page of pages"
                [class.active]="page === currPage"
                (click)="goToPage(page)"></a>
        </div>

        <ng-content select=".pagination-indicators"></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'nw-carousel',
    animations: [
        trigger('collapse', [
            transition(':leave', [
                style({ width: AUTO_STYLE }),
                animate(`300ms linear`, style({ width: 0 }))
            ])
        ])
    ]
})
export class CarouselComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges, OnDestroy {

    @Input() showPageIndicator: boolean = true;
    @Input() showPagination: boolean = true;
    @Input() showMask: boolean = true;
    @Input() maskColor: string = '#ffffff';
    @Input() containerClass: string;
    @Input() currPage: number = 0;
    @Input() noResultsText: string = "No results";

    @Output() currPageChange: EventEmitter<number> = new EventEmitter();

    @ViewChild('carousel', { static: true }) carousel: ElementRef;

    @ContentChildren(CarouselSlideDirective) slides: QueryList<CarouselSlideDirective>

    public pages: number[] = [];

    private _windowResizeSub: Subscription;
    private _slidesSub: Subscription;

    constructor(
        private _renderer: Renderer2,
        private _cdRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.subscribeToWindowResize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currPage && changes.currPage.previousValue !== changes.currPage.currentValue) {
            this._setScrollPosition(this.currPage);
        }
    }

    ngAfterViewInit() {
        this.updatePages();

        if (this.currPage !== 0) {
            this._setScrollPosition(this.currPage);
        }
    }

    ngAfterContentInit() {
        this._slidesSub = this.slides.changes.subscribe(res => {
            this.updatePages();
        })
    }

    next() {
        this.goToPage(Math.min(this.pages.length - 1, this.currPage + 1));
    }

    prev() {
        this.goToPage(Math.max(0, this.currPage - 1));
    }

    goToPage(page: number) {
        this.currPage = page;
        this.currPageChange.emit(this.currPage);

        this._setScrollPosition(page);
    }

    private _setScrollPosition(page: number): void {
        const carouselWidth: number = this.carouselNativeElement.clientWidth;
        const newScrollPosition: number = page * carouselWidth;

        this._renderer.setProperty(this.carouselNativeElement, 'scrollLeft', newScrollPosition);
    }

    getPages() {
        const estimatedPages: number = +(this.carouselNativeElement.scrollWidth / this.carouselNativeElement.clientWidth).toFixed(1)
        const numOfPages: number = Math.ceil(estimatedPages);

        return [...Array(numOfPages).fill(1)].map((_, i) => i);
    }

    updatePages(): void {
        this.pages = this.getPages();
        this._cdRef.detectChanges();
    }

    get carouselNativeElement(): HTMLDivElement {
        return (this.carousel.nativeElement as HTMLDivElement);
    }

    get isFirstPage(): boolean {
        return this.currPage === 0;
    }

    get isLastPage(): boolean {
        return this.currPage === this.pages[this.pages.length - 1]
    }

    get maskStyles() {
        return {
            '-webkit-mask-image': `linear-gradient(to left, rgba(0,0,0,0), ${this.maskColor})`,
            'background-color': `${this.maskColor}`
        }
    }

    get maskGradient() {
        return `linear-gradient(to left, rgba(0,0,0,0), ${this.maskColor})`;
    }

    subscribeToWindowResize() {
        this._windowResizeSub = fromEvent(window, 'resize')
            .pipe(debounceTime(100))
            .subscribe(_ => {
                this.goToPage(0);
                this.updatePages();
            })
    }

    ngOnDestroy() {
        this._windowResizeSub.unsubscribe();
        this._slidesSub.unsubscribe();
    }

}
