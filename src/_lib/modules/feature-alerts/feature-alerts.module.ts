import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureAlertsService } from './feature-alerts.service';
import { WindowRef } from './windowref';
import { HotspotComponent } from "./hotspot.component";
import { FeatureAlertsDirective } from './feature-alerts.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [WindowRef],
    declarations: [
        HotspotComponent,
        FeatureAlertsDirective
    ],
    exports: [
        HotspotComponent,
        FeatureAlertsDirective
    ]
})
export class FeatureAlertsModule {
    static forRoot(): ModuleWithProviders<FeatureAlertsModule> {
        return {
            ngModule: FeatureAlertsModule,
            providers: [FeatureAlertsService]
        };
    }
}
