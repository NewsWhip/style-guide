import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabDirective } from './tab.directive';

@NgModule({
    imports: [
        CommonModule,
        TabsComponent,
        TabDirective
    ],
    exports: [
        TabsComponent,
        TabDirective
    ]
})
export class TabsModule { }
