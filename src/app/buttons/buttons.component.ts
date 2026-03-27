import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss'],
    imports: [FormsModule]
})
export class ButtonsComponent{
    public sizes = ['xs', 'sm', 'md', 'lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt', 'activate'];
    public defaultBtnSize: string = 'lg';
    public btnGroupSize: string = '50%';
}
