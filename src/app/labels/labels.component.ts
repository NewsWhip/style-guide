import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-labels',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
