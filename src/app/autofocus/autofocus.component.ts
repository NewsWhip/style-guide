import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-autofocus',
  templateUrl: './autofocus.component.html',
  styleUrls: ['./autofocus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutofocusComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
