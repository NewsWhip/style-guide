import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsComponent } from './buttons.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ButtonsComponent', () => {
    let component: ButtonsComponent;
    let fixture: ComponentFixture<ButtonsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ButtonsComponent ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
