import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleDirective } from './circle.component';

describe('CircleComponent', () => {
  let component: CircleDirective;
  let fixture: ComponentFixture<CircleDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
