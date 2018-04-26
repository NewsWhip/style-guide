import { TestBed, inject } from '@angular/core/testing';

import { Toaster } from './toasts.service';

describe('ToastsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Toaster]
    });
  });

  it('should be created', inject([Toaster], (service: Toaster) => {
    expect(service).toBeTruthy();
  }));
});
