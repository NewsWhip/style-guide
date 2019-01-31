import { Directive, TemplateRef, ElementRef } from '@angular/core';

@Directive({
    selector: '[nw-carousel-slide]',
    exportAs: 'nw-carousel-slide'
})
export class CarouselSlideDirective {

    constructor(
        public templateRef: TemplateRef<any>,
        public elRef: ElementRef) { }

}
