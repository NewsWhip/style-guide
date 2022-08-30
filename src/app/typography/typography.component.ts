import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from "@angular/forms";

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent implements OnInit {

  public textColor: UntypedFormControl = new UntypedFormControl('light');
  public exampleText: string = 'The quick brown fox jumps over the lazy dog';

  constructor() { }

  ngOnInit() {
  }

  get randomLink(): string {
    return `https://www.google.ie/search?q=${Math.random() * (1000 - 99) + 99}`;
  }

  get colorVariant(): string {
    return this.textColor.value === 'light' ? '' : `nw-text-${this.textColor.value}`;
  }
}
