import { TestBed, inject } from '@angular/core/testing';

import { ToastsService } from './toasts.service';

describe('ToastsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastsService]
    });
  });

  it('should be created', inject([ToastsService], (service: ToastsService) => {
    expect(service).toBeTruthy();
  }));
});
