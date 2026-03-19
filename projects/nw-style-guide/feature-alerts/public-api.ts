export { FeatureAlertsService } from './feature-alerts.service';
export { IFeatureAlertParams } from './IFeatureAlertParams';
export { HotspotComponent } from './hotspot.component';
export { FeatureAlertsDirective } from './feature-alerts.directive';
export { WindowRef } from './windowref';

import { Provider } from '@angular/core';
import { FeatureAlertsService } from './feature-alerts.service';
import { WindowRef } from './windowref';

export function provideFeatureAlerts(): Provider[] {
    return [FeatureAlertsService, WindowRef];
}