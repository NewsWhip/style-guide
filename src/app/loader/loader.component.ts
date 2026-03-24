import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderComponent as NWLoaderComponent } from 'nw-style-guide/loader';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [FormsModule, NWLoaderComponent]
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
