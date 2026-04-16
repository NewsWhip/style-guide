export { TabDirective } from './tab.directive';
export { TabsComponent } from './tabs.component';

import { TabDirective } from './tab.directive';
import { TabsComponent } from './tabs.component';

/**
 * Export cooperating directives
 * https://v17.angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const TABS_DIRECTIVES = [TabDirective, TabsComponent] as const;
