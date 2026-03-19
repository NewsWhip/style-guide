import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    imports: [FormsModule]
})
export class FormsComponent implements OnInit {

  public showErrors: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
