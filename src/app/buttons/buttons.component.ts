import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-buttons',
    templateUrl: './buttons.component.html',
    standalone: true,
    imports: [NgFor, ReactiveFormsModule, FormsModule]
})
export class ButtonsComponent{
    public sizes = ['xs', 'sm', 'md', 'lg'];
    public btnNames = ['primary', 'secondary', 'danger', 'ghost', 'alt', 'activate'];
    public defaultBtnSize: string = 'lg';
    public btnGroupSize: string = '50%';
}
