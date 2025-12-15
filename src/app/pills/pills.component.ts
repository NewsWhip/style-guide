import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'nw-app-pills',
    templateUrl: './pills.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DemoPillsComponent {

}
