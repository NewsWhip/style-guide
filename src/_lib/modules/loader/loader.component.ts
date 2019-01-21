import { Component, Input } from '@angular/core';

@Component({
    selector: 'nw-loader',
    template: `
      <div *ngIf="isLoading;" class="nw-loader {{size}}">
        <div class="dots-icon-wrapper">
          <div class="dots">
            <span *ngFor="let d of dots" class="dot dot-{{d}}"></span>
          </div>
        </div>
      </div>
  `
})

export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() numOfDots: number = 3;
  @Input() size?: 'sm' | 'md' | 'lg' = 'md';


  get dots(): number[] {
    console.log(this.numOfDots)
    return Array(this.numOfDots).fill(0).map((x, i) => i + 1);
  }
}
