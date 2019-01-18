import { Component, Input } from '@angular/core';

@Component({
    selector: 'nw-loader',
    styleUrls: ['./loader.component.scss'],
    template: `
      <div *ngIf="isLoading;" class="nw-loader {{size}}" [ngClass]="{visible: isLoading}">
        <div class="dots-icon-wrapper" [ngClass]="{'pos-top': dotsPosTop}">
          <div class="dots">
            <span *ngFor="let d of dots" class="dot dot-{{d}}"></span>
          </div>
        </div>
      </div>
  `
})

export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() numOfDots: number = 6;
  @Input() size?: 'full-size' | 'inline' = 'full-size';
  @Input() dotsPosTop?: boolean = false;

  get dots(): number[] {
    return Array(this.numOfDots).fill(0).map((x, i) => i + 1);
  }
}
