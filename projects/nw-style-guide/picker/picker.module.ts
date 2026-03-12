import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NwPickerComponent } from './picker.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NwPickerComponent
    ],
    exports: [NwPickerComponent]
})
export class NwPickerModule { }