export { CarouselComponent } from './carousel.component';
export { CarouselSlideDirective } from './carousel-slide.directive';

import { CarouselComponent } from './carousel.component';
import { CarouselSlideDirective } from './carousel-slide.directive';

export const CAROUSEL_DIRECTIVES = [
    CarouselComponent,
    CarouselSlideDirective
] as const;