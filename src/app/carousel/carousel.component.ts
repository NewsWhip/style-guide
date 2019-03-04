import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

    public items: any[] = [];
    public numItems: number = 30;

    constructor(private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
        this.items = this.getItems();
    }

    getItems(): any[] {
        return [...Array(this.numItems).fill(1)].map((_, i) => i);
    }

    getExample1() {
        return `<nw-carousel maskColor="#373737">
    <ng-container *ngFor="let item of items">
        <div class="slide" nwCarouselSlide snapAlign="center" (click)="log('test')"
            [style.background-image]="'url(https://picsum.photos/216/120?image=' + item +')'">Slide {{item}}</div>
    </ng-container>
</nw-carousel>`
    }

    getExample2() {
        return `<nw-carousel maskColor="#373737" #carousel="nw-carousel" [showPageIndicator]="false" [showPagination]="false">
    <ng-container *ngFor="let item of items">
        <div class="slide"
            [style.background-color]="'grey'">Slide {{item}}</div>
    </ng-container>

    <div class="pagination-left">
        <button class="btn btn-primary btn-md" (click)="carousel.prev()">Prev</button>
    </div>

    <div class="pagination-right">
        <button class="btn btn-primary btn-md" (click)="carousel.next()">Next</button>
    </div>

    <div class="pagination-indicators" style="width: 100%; text-align: center;">
        <button class="btn sm btn-primary" *ngFor="let page of carousel.getPages()" [class.active]="page === carousel.currPage"
            (click)="carousel.goToPage(page)">
            {{page + 1}}
        </button>
    </div>
</nw-carousel>`
    }

}
