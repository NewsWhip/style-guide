import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';

@NgModule({
    imports: [
        CommonModule,
        LoaderComponent
    ],
    exports: [LoaderComponent]
})
export class LoaderModule { }
