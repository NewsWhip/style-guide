import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spacing',
  templateUrl: './spacing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
