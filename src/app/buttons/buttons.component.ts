import { Component } from '@angular/core';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html'
})
export class ButtonsComponent{
    public sizes = ['sm', 'md', 'lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt'];
    public defaultBtnSize: string = 'lg';
    public btnGroupSize: string = '50%';
}
