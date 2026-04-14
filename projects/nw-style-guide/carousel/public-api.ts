export { CarouselComponent } from './carousel.component';
export { CarouselSlideDirective } from './carousel-slide.directive';

import { CarouselComponent } from './carousel.component';
import { CarouselSlideDirective } from './carousel-slide.directive';

/**
 * Export cooperating directives
 * https://v17.angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const CAROUSEL_DIRECTIVES = [CarouselComponent, CarouselSlideDirective] as const;
