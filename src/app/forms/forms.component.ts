import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'nw-app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FormsComponent {

    public showErrors: boolean = false;

}
