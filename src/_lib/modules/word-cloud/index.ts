import { WordCloudComponent } from './word-cloud.component';
import { WordComponent } from './word.component';

export { WordCloudComponent } from './word-cloud.component';
export { WordComponent } from './word.component';

/**
 * Generally speaking, these are cooperating directives and any consumer will likely need to import all of them. To
 * make this easier they can import the collection of directive rather then importing each one individually
 *
 * ref: https://angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const WORD_CLOUD_DIRECTIVES = [
    WordCloudComponent,
    WordComponent
] as const;