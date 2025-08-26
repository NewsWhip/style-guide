import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCloudComponent } from './word-cloud.component';
import { WordComponent } from './word.component';
import { ResizeObserverModule } from 'nw-style-guide/resize-observer';

@NgModule({
    imports: [
        CommonModule,
        ResizeObserverModule
    ],
    declarations: [
        WordCloudComponent,
        WordComponent
    ],
    exports: [
        WordCloudComponent,
        WordComponent
    ]
})
export class WordCloudModule { }
