import { Component } from '@angular/core';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    standalone: false
})
export class FormsComponent {

  public showErrors: boolean = false;

}
