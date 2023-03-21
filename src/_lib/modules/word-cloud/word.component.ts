import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IPlacedWord } from "./models/IPlacedWord";

@Component({
    selector: 'nw-word',
    templateUrl: './word.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
export class WordComponent implements OnChanges {

    @Input() word: IPlacedWord;

    @HostBinding('style.translate')
    public translate: string;
    @HostBinding('style.fontSize.px')
    public fontSize: number;
    @HostBinding('style.lineHeight.px')
    public lineHeight: number;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.word?.currentValue !== changes.word?.previousValue) {
            this.translate = `${this.word.x}px ${this.word.y}px`;
            this.fontSize = this.word.wordDetails.fontSize;
            this.lineHeight = this.word.height;
        }
    }

}