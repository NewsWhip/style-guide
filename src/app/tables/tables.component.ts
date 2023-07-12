import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, NgFor]
})
export class TablesComponent implements OnInit {

    public isTall: boolean = false;

    constructor() { }

    ngOnInit() {
    }

}
