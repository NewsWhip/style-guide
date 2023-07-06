import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule]
})
export class FormsComponent implements OnInit {

  public showErrors: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
