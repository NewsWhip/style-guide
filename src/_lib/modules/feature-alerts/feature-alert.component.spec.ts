import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import { FeatureAlertComponent } from './feature-alert.component';
import {FeatureAlertsService} from './feature-alerts.service';

class FeatureAlertsServiceMock {}

describe('FeatureAlertComponent', () => {
    let component: FeatureAlertComponent;
    let fixture: ComponentFixture<FeatureAlertComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ FeatureAlertComponent ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{
                provide: FeatureAlertsService,
                useClass: FeatureAlertsServiceMock
            }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeatureAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});
