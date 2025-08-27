import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: false
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
