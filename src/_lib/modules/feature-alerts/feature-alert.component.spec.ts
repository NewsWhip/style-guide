import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAlertComponent } from './feature-alert.component';

describe('FeatureAlertComponent', () => {
  let component: FeatureAlertComponent;
  let fixture: ComponentFixture<FeatureAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
