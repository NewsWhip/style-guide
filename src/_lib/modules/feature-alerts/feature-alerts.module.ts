import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAlertComponent } from './feature-alert.component';
import { FeatureAlertsService } from './feature-alerts.service';
import { WindowRef } from './windowref';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { HotspotComponent } from "./hotspot.component";

@NgModule({
  imports: [
    CommonModule,
    PopoverModule.forRoot()
  ],
  providers: [WindowRef],
  declarations: [FeatureAlertComponent, HotspotComponent],
  exports: [FeatureAlertComponent, HotspotComponent]
})
export class FeatureAlertsModule {
  static forRoot(): ModuleWithProviders<FeatureAlertsModule> {
    return {
      ngModule: FeatureAlertsModule,
      providers: [FeatureAlertsService]
    };
  }
}
