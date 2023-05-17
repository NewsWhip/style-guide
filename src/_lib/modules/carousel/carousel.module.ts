import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { CarouselSlideDirective } from './carousel-slide.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CarouselComponent, CarouselSlideDirective],
    exports: [CarouselComponent, CarouselSlideDirective]
})
export class CarouselModule { }
