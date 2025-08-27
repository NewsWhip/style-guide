import { Component } from '@angular/core';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss'],
    standalone: false
})
export class ButtonsComponent{
    public sizes = ['xs', 'sm', 'md', 'lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt', 'activate'];
    public defaultBtnSize: string = 'lg';
    public btnGroupSize: string = '50%';
}
