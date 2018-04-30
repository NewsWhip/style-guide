import { Component, OnInit } from '@angular/core';

import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {FeatureAlertsService} from "./feature-alerts.service";

@Component({
    selector: '[nw-feature-alert]',
    styleUrls: ['./feature-alert.component.scss'],
    template: `
        <ng-template #popTmpl let-title="title" let-message="message">
            <h5>{{title}}</h5>
            <p>{{message}}</p>

            <button class="btn-primary" (click)="onCTAClick()">Try it Now</button>

            <button class="close" type="button" (click)="onClose()">
                <span aria-hidden="true">&times;</span>
            </button>
        </ng-template>

        <span #popTriggerEl="bs-popover"
            [popover]="popTmpl"
            [triggers]="params.triggers"
            [placement]="params.placement"
            [container]="params.container"
            [containerClass]="params.containerClass"
            [popoverContext]="params"
            [isOpen]="isOpen">
            <ng-content></ng-content>
        </span>
    `
})

export class FeatureAlertComponent implements optimizenInit {
    @ViewChild('popTriggerEl') popTriggerEl;
    @Input() params: IFeatureAlertParams;
    @Output() callToActionClick: EventEmitter<any> = new EventEmitter<any>();
    isOpen: boolean;

    constructor(private featureAlertsService: FeatureAlertsService){}

    ngOnInit(){
        this.isOpen = !this.featureAlertsService.wasAlertDismissed(this.params.id);
    }

    onCTAClick(){
        this.popTriggerEl.hide();
        this.featureAlertsService.persist(this.params.id);
        this.callToActionClick.emit();
    }

    onClose(){
        this.popTriggerEl.hide();
        this.featureAlertsService.persist(this.params.id);
    }
}
