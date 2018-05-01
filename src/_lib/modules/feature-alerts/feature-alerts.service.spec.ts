import { TestBed, inject } from '@angular/core/testing';
import {FeatureAlertsService} from './feature-alerts.service';

describe('FeatureAlertsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureAlertsService]
    });
  });

  it('should be created', inject([FeatureAlertsService], (service: FeatureAlertsService) => {
    expect(service).toBeTruthy();
  }));
});
