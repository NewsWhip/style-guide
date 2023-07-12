import { TabDirective } from './tab.directive';
import { TabsComponent } from './tabs.component';

export { TabDirective } from './tab.directive';
export { TabsComponent } from './tabs.component';

/**
 * Generally speaking, these are cooperating directives and any consumer will likely need to import all of them. To
 * make this easier they can import the collection of directive rather then importing each one individually
 *
 * ref: https://angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const TAB_DIRECTIVES = [
    TabDirective,
    TabsComponent
] as const;
