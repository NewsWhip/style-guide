import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: false
})
export class LoaderComponent {
  private _num: number = 6;
  public size: string = 'md';

  get num(): number {
    return this._num;
  }

  set num(value: number) {
    this._num = +value;
  }
}
