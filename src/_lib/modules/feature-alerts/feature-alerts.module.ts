import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAlertComponent } from './feature-alert.component';
import { FeatureAlertsService } from './feature-alerts.service';
import { WindowRef } from './windowref';
import {PopoverModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    PopoverModule.forRoot() //thanks to this line we no longer have to
    // import it in app.module.ts ofthe demo app
  ],
  providers: [WindowRef],
  declarations: [FeatureAlertComponent],
  exports: [FeatureAlertComponent]
})
export class FeatureAlertsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FeatureAlertsModule,
      providers: [FeatureAlertsService]
    }
  }
}
