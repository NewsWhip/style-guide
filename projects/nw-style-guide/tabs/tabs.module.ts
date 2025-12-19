import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { TabDirective } from './tab.directive';

@NgModule({
    imports: [
        TabsComponent,
        TabDirective
    ],
    exports: [
        TabsComponent,
        TabDirective
    ]
})
export class TabsModule { }
