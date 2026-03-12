import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import { IWord } from "./models/IWord";
import { IWordWithPosition } from "./models/IWordWithPosition";

@Component({
    selector: 'nw-word',
    templateUrl: './word.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordComponent<T extends IWord> implements OnChanges {

    @Input() word: IWordWithPosition<T>;

    @HostBinding('style.translate')
    public translate: string;
    @HostBinding('style.fontSize.px')
    public fontSize: number;
    @HostBinding('style.lineHeight.px')
    public lineHeight: number;
    @HostBinding('style.width.px')
    public width: number;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.word?.currentValue !== changes.word?.previousValue) {
            this.translate = `${this.word.x}px ${this.word.y}px`;
            this.fontSize = this.word.fontSize;
            this.lineHeight = this.word.height;
            this.width = this.word.width;
        }
    }

}