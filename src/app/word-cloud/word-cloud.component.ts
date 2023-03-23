import { Component, ElementRef, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { WordCloudComponent } from '../../_lib/modules/word-cloud';
import { IPlacedWord } from '../../_lib/modules/word-cloud/models/IPlacedWord';

@Component({
    selector: 'app-home',
    templateUrl: './word-cloud.component.html',
    styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudDemoComponent implements OnInit {

    @ViewChild(WordCloudComponent) wordCloud: WordCloudComponent;

    public words: { value: string; weight: number }[];
    public placedWords: IPlacedWord[] = [];
    public exportedCanvas: HTMLCanvasElement;

    constructor(
        private _renderer: Renderer2,
        private _elRef: ElementRef<HTMLElement>) {}

    ngOnInit() {
        this.generateWords();
    }

    generateWords() {
        this.words = this._generateInputWords();
    }

    wordTrack(index: number, item: IPlacedWord) {
        return index + item.wordDetails.value;
    }

    export() {
        this.exportedCanvas = this.wordCloud.getCanvas();
        this._renderer.appendChild(this._elRef.nativeElement, this.exportedCanvas);
    }

    private _generateInputWords() {
        const words = ["document", "scatter", "outside", "Compromise", "finished", "reluctance", "discount", "content", "banish", "mainstream", "sail", "porter", "climb", "Europe", "fixture", "fail", "revolution", "consideration", "reader", "receipt", "half", "concentrate", "dynamic", "continuation", "racism", "crack", "treat", "greet", "coalition", "grain"];

        return words.map((value, i) => {
            return {
                value,
                weight: Math.floor(Math.random() * 50 * (i + 1))
            };
        })
    }

}
