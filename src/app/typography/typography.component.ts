import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-typography',
    templateUrl: './typography.component.html',
    styleUrls: ['./typography.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, CommonModule]
})
export class TypographyComponent implements OnInit {

  public textColor: FormControl = new FormControl('light');
  public exampleText: string = 'The quick brown fox jumps over the lazy dog';
  public randomLink: string ='';

  constructor() { }

  ngOnInit() {
    this.randomLink = `https://www.google.ie/search?q=${Math.random() * (1000 - 99) + 99}`;
  }

  get colorVariant(): string {
    return this.textColor.value === 'light' ? '' : `nw-text-${this.textColor.value}`;
  }
}
