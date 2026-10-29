import { Component, VERSION, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    public version = VERSION;
}
