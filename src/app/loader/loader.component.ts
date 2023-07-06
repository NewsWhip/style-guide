import { Component, OnInit } from '@angular/core';
import { LoaderComponent as LoaderComponent_1 } from '../../_lib/modules/loader/loader.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, LoaderComponent_1]
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
