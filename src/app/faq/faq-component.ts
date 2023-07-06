import { Component } from "@angular/core";

@Component({
    selector: 'app-faq',
    template: `
        <div class="question" (click)="isOpen = !isOpen"
            [class.open]="isOpen">
            <i class="fas fa-caret-circle-right arrow"></i>
            <ng-content select="[question]"></ng-content>
        </div>
        <div class="answer" [class.hidden]="!isOpen">
            <ng-content select="[answer]"></ng-content>
        </div>
    `,
    standalone: true
})
export class FaqComponent {

    public isOpen: boolean = false;

}