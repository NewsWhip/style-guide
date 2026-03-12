export { TabDirective } from './tab.directive';
export { TabsComponent } from './tabs.component';

import { TabDirective } from './tab.directive';
import { TabsComponent } from './tabs.component';

export const TABS_DIRECTIVES = [
    TabDirective,
    TabsComponent
] as const;
