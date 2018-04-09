import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html'
})
export class ButtonsComponent implements OnInit {

    public sizes = ['sm','md','lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt'];
    public defaultBtnSize: string = "lg";
    public btnGroupSize: string = '50%';

    constructor() { }

    ngOnInit() {
    }

}
