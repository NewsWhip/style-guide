import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-md';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _markdown: MarkdownService) { }

  ngOnInit() {
    this._markdown.renderer.heading = (text: string, level: number) => {
      return `<h${level} ${level === 1 ? 'class="page-header"' : ''}>${text}</h${level}>`
    }
  }

}
