import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
    selector: '[nwCarouselSlide]',
    exportAs: 'nw-carousel-slide',
    standalone: false
})
export class CarouselSlideDirective {

    @HostBinding('style.scroll-snap-align')
    @Input() snapAlign: 'none' | 'start' | 'end' | 'center' = 'start';

}
