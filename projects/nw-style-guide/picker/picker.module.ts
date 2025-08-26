import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NwPickerComponent } from './picker.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ],
    declarations: [NwPickerComponent],
    exports: [NwPickerComponent]
})
export class NwPickerModule { }