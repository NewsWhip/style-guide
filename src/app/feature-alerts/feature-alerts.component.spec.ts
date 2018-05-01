import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import { FeatureAlertsComponent } from './feature-alerts.component';

describe('FeatureAlertsComponent', () => {
    let component: FeatureAlertsComponent;
    let fixture: ComponentFixture<FeatureAlertsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FeatureAlertsComponent ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeatureAlertsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
