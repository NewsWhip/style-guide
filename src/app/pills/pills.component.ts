import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-pills',
    templateUrl: './pills.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPillsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
