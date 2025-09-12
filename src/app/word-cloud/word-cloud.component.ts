import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IWordWithPosition } from 'nw-style-guide/word-cloud/models/IWordWithPosition';
import { WordCloudComponent } from 'nw-style-guide/word-cloud';
import { IWord } from 'nw-style-guide/word-cloud/models/IWord';
import { ActivatedRoute } from '@angular/router';
import { ISnippet } from '../code/ISnippet';
import { IWordCloudConfig } from 'nw-style-guide/word-cloud/models/IWordCloudConfig';

interface IMyWord extends IWord {
    id: number;
}

@Component({
    selector: 'app-home',
    templateUrl: './word-cloud.component.html',
    styleUrls: ['./word-cloud.component.scss'],
    standalone: false
})
export class WordCloudDemoComponent implements OnInit {

    @ViewChild(WordCloudComponent) wordCloud: WordCloudComponent<IMyWord>;

    public selectedTab: 'design' | 'api' = 'design';
    public words: IMyWord[];
    public positionedWords: IWordWithPosition<IMyWord>[] = [];
    public config: Partial<IWordCloudConfig> = {
        debugMode: false
    }

    constructor(
        private _route: ActivatedRoute,
        private _cdRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.generateWords();

        this._route.queryParams.subscribe(params => {
            this.selectedTab = params.section || 'design';
            this._cdRef.detectChanges();
        });
    }

    generateWords() {
        this.words = this._generateInputWords();
    }

    wordTrack(index: number, item: IWord) {
        return index + item.value;
    }

    download() {
        this.wordCloud.downloadCanvas('word-cloud');
    }

    onWordsPositioned(words: IWordWithPosition<IMyWord>[]) {
        this.positionedWords = words;
    }

    public snippets: { [key: string]: ISnippet } = {
        import: {
            lang: 'typescript',
            code: `
                import { WordCloudModule } from 'nw-style-guide/word-cloud';
            `
        },
        example: {
            lang: 'html',
            code: `
                <nw-word-cloud
                    [words]="words"
                    (wordsPositioned)="positionedWords = $event">
            
                    <nw-word *ngFor="let word of positionedWords" [word]="word"></nw-word>
                </nw-word-cloud>
            `
        },
        exampleWithAdditions: {
            lang: 'html',
            code: `
                <nw-word-cloud
                    [words]="words"
                    [options]="{ minFontSize: 20, fontWeight: 'bold' }"
                    (wordsPositioned)="positionedWords = $event">
            
                    <nw-word *ngFor="let word of positionedWords; trackBy: wordTrack"
                        [word]="word"
                        [nwTooltip]="word.value + ' has a weight of ' + word.weight"
                        [placement]="'top'"
                        [style.cursor]="'pointer'"></nw-word>
                </nw-word-cloud>
            `
        },
        selector: {
            lang: 'html',
            code: `
                <nw-word-cloud>...</nw-word-cloud>
            `
        },
        wordComponentSelector: {
            lang: 'html',
            code: `
                <nw-word>...</nw-word>
            `
        },
    }

    public wordCloudPropertiesTable: [string, string, string][] = [
        [
            "@Input() words: T[]",
            "A generic collecion of word objects that must satisfy the <code>IWord</code> interface",
            "undefined"
        ],
        [
            "@Input() options: Partial<IWordCloudConfig>",
            'An optional config to override the default word cloud config',
            `{
                debugMode: false,
                fontFamily: 'ProximaNova',
                fontWeight: 'normal',
                maxFontSize: 48,
                minFontSize: 16,
                paddingX: 8,
                paddingY: 8,
                maxCharCount: 20,
                resizeTolerance: 0
            }`
        ],
        [
            "@Output() wordsPositioned: EventEmitter<IWordWithPosition<T>[]>",
            "An event emitter that fires when the words have been sized and positioned",
            "-"
        ]
    ];

    public wordComponentPropertiesTable: [string, string, string][] = [
        [
            "@Input() word: IWordWithPosition<T>",
            "A single word from the generic collecion of word objects emitted from the <code>WordCloudComponent</code>",
            "undefined"
        ]
    ];

    public wordInterfaceDetails = [
        {
            name: 'value: string',
            description: 'The value of the word itself, e.g. "Cheese", "Starlink", "Donald Trump"'
        },
        {
            name: 'weight: number',
            description: 'The weight of the word relative to the others. This could be based on a score, engagement, frequency etc.'
        },
        {
            name: 'exportColor: string',
            description: 'Any valid CSS color that will be used when exporting the cloud to an image'
        }
    ]

    public configInterfaceDetails = [
        {
            name: 'debugMode: boolean',
            description: 'When set to true, logs debug information and renders a canvas to help debug sizing and positioning'
        },
        {
            name: 'fontFamily: string',
            description: 'The fontFamily of the words in the cloud; required for accurate positioning'
        },
        {
            name: 'fontWeight: string',
            description: 'The fontWeight of the words in the cloud; required for accurate positioning'
        },
        {
            name: 'minFontSize: number',
            description: 'The fontSize to use for the word with the smallest weight'
        },
        {
            name: 'maxFontSize: number',
            description: 'The fontSize to use for the word with the largest weight'
        },
        {
            name: 'paddingX: number',
            description: 'A pixel value used to specify the horizontal space between words'
        },
        {
            name: 'paddingY: number',
            description: 'A pixel value used to specify the vertical space between words'
        },
        {
            name: 'maxCharCount: number',
            description: 'The character count at which words should be truncated and ellipsis appended'
        },
        {
            name: 'resizeTolerance: number',
            description: 'A pixel value specifying the minimum change in height or width that triggers the resize event'
        }
    ]

    public wordWithPositionInterfaceDetails = [
        {
            name: 'x: number',
            description: 'The x position of the word used to absolutely position element in the DOM'
        },
        {
            name: 'y: number',
            description: 'The y position of the word used to absolutely position element in the DOM'
        },
        {
            name: 'canvasX: number',
            description: 'Used to redraw the words when exporting the word cloud to PNG'
        },
        {
            name: 'canvasY: number',
            description: 'Used to redraw the words when exporting the word cloud to PNG'
        },
        {
            name: 'width: number',
            description: 'The width of the bounding box of the word'
        },
        {
            name: 'height: number',
            description: 'The height of the bounding box of the word'
        },
        {
            name: 'fontSize: number',
            description: 'The fontSize of the word'
        }
    ]

    private _generateInputWords(): IMyWord[] {
        const words = ["document", "scatter", "outside", "Compromise", "finished", "reluctance", "discount", "content-stuff", "banish", "mainstream", "sail", "porter", "climb", "Europe", "fixture", "fail", "revolution", "consideration", "reader", "receipt", "half", "concentrate", "dynamic", "continuation", "racism", "crack", "treat", "greet", "coalition", "grain"];

        return words.map((value, i) => {
            return {
                value,
                weight: Math.floor(Math.random() * 50 * (i + 1)),
                color: 'white',
                exportColor: 'black',
                id: i
            };
        });
    }

}
