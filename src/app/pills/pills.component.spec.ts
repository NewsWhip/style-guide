import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPillsComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: DemoPillsComponent;
  let fixture: ComponentFixture<DemoPillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
