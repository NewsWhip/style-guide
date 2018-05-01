import { TestBed, inject } from '@angular/core/testing';
import {FeatureAlertsService} from './feature-alerts.service';
import {WindowRef} from './windowref';

class WindowRefMock {}

describe('FeatureAlertsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          FeatureAlertsService,
          {
              provide: WindowRef,
              useClass: WindowRefMock
          }
      ],
    });
  });

  it('should be created', inject([FeatureAlertsService], (service: FeatureAlertsService) => {
    expect(service).toBeTruthy();
  }));
});
