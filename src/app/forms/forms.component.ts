import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: [`./forms.component.scss`],
    standalone: false
})
export class FormsComponent implements OnInit {

  public showErrors: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
