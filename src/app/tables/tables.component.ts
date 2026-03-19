import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    imports: [FormsModule]
})
export class TablesComponent implements OnInit {

    public isTall: boolean = false;

    constructor() { }

    ngOnInit() {
    }

}
