import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { LoadingComponent } from './loading.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoaderComponent, LoadingComponent],
  exports: [LoaderComponent, LoadingComponent]
})
export class LoaderModule { }
