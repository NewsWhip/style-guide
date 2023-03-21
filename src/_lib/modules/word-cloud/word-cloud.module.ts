import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordCloudComponent } from './word-cloud.component';
import { WordComponent } from './word.component';

@NgModule({
    imports: [
        CommonModule
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
