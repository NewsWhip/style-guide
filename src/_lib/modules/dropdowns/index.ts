import { DropdownDirective } from './dropdown.directive';
import { DropdownToggleDirective } from './dropdown-toggle.directive';
import { DropdownMenuDirective } from './dropdown-menu.directive';

export { DropdownDirective } from './dropdown.directive';
export { DropdownToggleDirective } from './dropdown-toggle.directive';
export { DropdownMenuDirective } from './dropdown-menu.directive';

/**
 * Generally speaking, these are cooperating directives and any consumer will likely need to import all of them. To
 * make this easier they can import the collection of directive rather then importing each one individually
 *
 * ref: https://angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const DROPDOWN_DIRECTIVES = [
    DropdownDirective,
    DropdownToggleDirective,
    DropdownMenuDirective
] as const;
