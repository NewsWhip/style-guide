import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoaderModule } from 'nw-style-guide/loader';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoaderModule]
})
export class LoaderComponent implements OnInit {
  private _num: number = 6;
  public size: string = 'md';

  constructor() {}

  ngOnInit() {}

  get num(): number {
    return this._num;
  }

  set num(value: number) {
    this._num = +value;
  }
}
