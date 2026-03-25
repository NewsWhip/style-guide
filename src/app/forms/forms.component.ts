import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    imports: [FormsModule]
})
export class FormsComponent {

  public showErrors: boolean = false;

}
