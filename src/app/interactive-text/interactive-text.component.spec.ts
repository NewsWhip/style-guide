import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTextComponent } from './interactive-text.component';

describe('InteractiveTextComponent', () => {
  let component: InteractiveTextComponent;
  let fixture: ComponentFixture<InteractiveTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
