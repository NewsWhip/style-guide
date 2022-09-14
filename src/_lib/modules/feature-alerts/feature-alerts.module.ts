import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAlertsService } from './feature-alerts.service';
import { WindowRef } from './windowref';
import { HotspotComponent } from "./hotspot.component";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [WindowRef],
  declarations: [HotspotComponent],
  exports: [HotspotComponent]
})
export class FeatureAlertsModule {
  static forRoot(): ModuleWithProviders<FeatureAlertsModule> {
    return {
      ngModule: FeatureAlertsModule,
      providers: [FeatureAlertsService]
    };
  }
}
