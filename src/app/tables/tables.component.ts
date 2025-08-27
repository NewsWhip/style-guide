import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    standalone: false
})
export class TablesComponent implements OnInit {

    public isTall: boolean = false;

    constructor() { }

    ngOnInit() {
    }

}
