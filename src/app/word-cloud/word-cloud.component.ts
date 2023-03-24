import { Component, ElementRef, OnInit, Renderer2, VERSION, ViewChild } from '@angular/core';
import { IWordWithPosition } from '../../_lib/modules/word-cloud/models/IWordWithPosition';
import { WordCloudComponent } from '../../_lib/modules/word-cloud';
import { IWord } from '../../_lib/modules/word-cloud/models/IWord';

interface IMyWord extends IWord {
    someProp1: string;
    someProp2: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './word-cloud.component.html',
    styleUrls: ['./word-cloud.component.scss']
})
export class WordCloudDemoComponent implements OnInit {

    @ViewChild(WordCloudComponent) wordCloud: WordCloudComponent<IMyWord>;

    public words: IMyWord[];
    public placedWords: IWordWithPosition<IMyWord>[] = [];
    public exportedCanvas: HTMLCanvasElement;

    constructor(
        private _renderer: Renderer2,
        private _elRef: ElementRef<HTMLElement>) { }

    ngOnInit() {
        this.generateWords();
    }

    generateWords() {
        this.words = this._generateInputWords();
    }

    wordTrack(index: number, item: IWord) {
        return index + item.value;
    }

    export() {
        this.exportedCanvas = this.wordCloud.getCanvas();
        this._renderer.appendChild(this._elRef.nativeElement, this.exportedCanvas);
    }

    onWordsPlaced(words: IWordWithPosition<IMyWord>[]) {
        this.placedWords = words;
    }

    private _generateInputWords(): IMyWord[] {
        const words = ["document", "scatter", "outside", "Compromise", "finished", "reluctance", "discount", "content", "banish", "mainstream", "sail", "porter", "climb", "Europe", "fixture", "fail", "revolution", "consideration", "reader", "receipt", "half", "concentrate", "dynamic", "continuation", "racism", "crack", "treat", "greet", "coalition", "grain"];

        return words.map((value, i) => {
            return {
                value,
                weight: Math.floor(Math.random() * 50 * (i + 1)),
                color: 'white',
                exportColor: 'black',
                someProp1: 'test1',
                someProp2: 'test2'
            };
        });
    }

}
