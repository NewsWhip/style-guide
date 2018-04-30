import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabsDirective } from './tabs.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      TabsComponent,
      TabsDirective
  ],
  exports: [
      TabsComponent,
      TabsDirective
  ]
})
export class TabsModule { }
