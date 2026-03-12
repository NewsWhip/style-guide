import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailInputComponent } from './email-input.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EmailInputComponent
    ],
    exports: [EmailInputComponent]
})
export class EmailInputModule { }
