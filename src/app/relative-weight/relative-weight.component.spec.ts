import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeWeightComponent } from './relative-weight.component';

describe('RelativeWeightComponent', () => {
  let component: RelativeWeightComponent;
  let fixture: ComponentFixture<RelativeWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativeWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
