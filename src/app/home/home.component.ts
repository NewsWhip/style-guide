import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';

@Component({
    selector: 'nw-app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HomeComponent {

    public version = VERSION;

}
