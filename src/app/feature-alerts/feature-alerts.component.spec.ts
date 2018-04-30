import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAlertsComponent } from './feature-alerts.component';

describe('FeatureAlertsComponent', () => {
  let component: FeatureAlertsComponent;
  let fixture: ComponentFixture<FeatureAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
