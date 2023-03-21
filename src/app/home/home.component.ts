import { Component, OnInit, VERSION } from '@angular/core';
import { IPlacedWord } from '../../_lib/modules/charts/word-cloud/models/IPlacedWord';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public version = VERSION;
    public words: { value: string; weight: number }[];
    public placedWords: IPlacedWord[] = [];

    ngOnInit() {
        this.generateWords();
    }

    generateWords() {
        this.words = this._generateInputWords();
    }

    wordTrack(index: number, item: IPlacedWord) {
        return index + item.wordDetails.value;
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
