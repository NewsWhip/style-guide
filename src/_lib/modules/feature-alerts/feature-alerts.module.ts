import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAlertComponent } from './feature-alerts.component';
import { FeatureAlertsService } from './feature-alerts.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FeatureAlertComponent]
})
export class FeatureAlertsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FeatureAlertsModule,
      providers: [FeatureAlertsService]
    }
  }
}
