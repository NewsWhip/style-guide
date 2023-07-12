import { CarouselComponent } from './carousel.component';
import { CarouselSlideDirective } from './carousel-slide.directive';

export { CarouselComponent } from './carousel.component';
export { CarouselSlideDirective } from './carousel-slide.directive';

/**
 * Generally speaking, these are cooperating directives and any consumer will likely need to import all of them. To
 * make this easier they can import the collection of directive rather then importing each one individually
 *
 * ref: https://angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const CAROUSEL_DIRECTIVES = [
    CarouselComponent,
    CarouselSlideDirective
] as const;
