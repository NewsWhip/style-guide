import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

    public items: any[] = [];

    constructor() { }

    ngOnInit() {
        this.items = this.getItems();
    }

    getItems(): any[] {
        return [...Array(30).fill(1)].map((_, i) => i);
    }

}
