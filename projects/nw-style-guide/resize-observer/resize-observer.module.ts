import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeObserverDirective } from './resize-observer.directive';

@NgModule({
    imports: [
        CommonModule,
        ResizeObserverDirective
    ],
    exports: [ResizeObserverDirective]
})
export class ResizeObserverModule { }
