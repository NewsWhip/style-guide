import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { IBoundingBox } from "./models/IBoundingBox";
import { IGridPoint } from "./models/IGridPoint";
import { IPlacedWord } from "./models/IPlacedWord";
import { IWordDetails } from "./models/IWordDetails";

@Component({
    selector: 'nw-word-cloud',
    templateUrl: './word-cloud.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
/**
 * Todos
 * - Test with very long words
 * - Don't draw a spiral
 *      - loop until all words are placed
 *      - then scale the canvas to fit all words (with padding)
 *      - adjust font-sizes based on scale
 * - try log n scaling for font-sizes (https://www.jasondavies.com/wordcloud/)
 * - can I support multiple orientations
 * - issue where font may not be loaded when we're drawing to the canvas
 *      - https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check
 * - can I make it easy to export
 */
export class WordCloudComponent implements OnChanges {

    @Input() words: { value: string; weight: number }[];

    @Output() wordsPlaced: EventEmitter<IPlacedWord[]> = new EventEmitter();

    public placedWords: IPlacedWord[];

    private _fontSizes = {
        min: 10,
        max: 60
    };
    private _words: IWordDetails[];
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _grid: IGridPoint[];
    private _gridResolution = 1;
    private _occupiedBoundingBoxes: IBoundingBox[];

    constructor(
        private _elRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.words?.currentValue !== changes.words?.previousValue) {
            this._init();
        }
    }

    private _init() {
        this._words = this._getWords();
        this._grid = [];
        this._occupiedBoundingBoxes = [];
        this.placedWords = [];
        this._drawCanvas();
        this._drawSpiral();
        this._placeWords();
    }

    private _getWords(): IWordDetails[] {
        return this.words.map(word => {
            return {
                value: word.value,
                weight: word.weight,
                fontSize: this._getFontSize(word.weight)
            };
        }).sort((a, b) => b.weight - a.weight);
    }

    private _drawCanvas() {
        this._canvas = this._canvas || this._renderer.createElement('canvas');
        this._canvas.width = this._elRef.nativeElement.parentElement.clientWidth;
        this._canvas.height = this._elRef.nativeElement.parentElement.clientHeight;
        this._ctx = this._canvas.getContext('2d');
        // this._renderer.appendChild(this._elRef.nativeElement, this._canvas);
    }

    private _placeWords() {
        const t1 = performance.now();

        const placeWord = (wordDetails: IWordDetails, gridIndex: number = 0) => {
            this._ctx.font = `normal ${wordDetails.fontSize}px ProximaNova`;
            this._ctx.textAlign = "center";
            this._ctx.textBaseline = "middle";
            this._ctx.fillStyle = 'rgba(0,0,0,1)';

            const gridPoint = this._grid[gridIndex];
            const metrics = this._ctx.measureText(wordDetails.value);
            // Todo: browser support issue
            // const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
            // const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            const fontHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 1.1;

            /**
             * Adjust the x and y based on textAlign = "center" and textBaseline = "middle";
             */
            const boundingBox: IBoundingBox = {
                x: gridPoint.x - (metrics.width / 2),
                y: gridPoint.y - (fontHeight / 2),
                width: metrics.width,
                height: fontHeight
            }

            if (this._isIntersecting(boundingBox)) {
                return placeWord(wordDetails, gridIndex + 1);
            }

            this._occupiedBoundingBoxes = this._occupiedBoundingBoxes.concat(boundingBox);
            this.placedWords = this.placedWords.concat({
                wordDetails,
                x: boundingBox.x,
                y: boundingBox.y
            });
            this._ctx.strokeStyle = 'blue';
            this._ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            this._ctx.fillText(wordDetails.value, gridPoint.x, gridPoint.y);
        };

        this._words.forEach(word => {
            placeWord(word);
        });

        const sortedWords = this.placedWords.sort((a, b) => a.wordDetails.value.localeCompare(b.wordDetails.value))
        this.wordsPlaced.emit(sortedWords);
        console.log(`Words placed on sprial in ${performance.now() - t1}ms`);
    }

    private _isIntersecting(boundingBox: IBoundingBox): boolean {
        const doBoxesOverlap = (boxA: IBoundingBox, boxB: IBoundingBox): boolean => {
            return !(boxA.x + boxA.width < boxB.x ||
                boxB.x + boxB.width < boxA.x ||
                boxA.y + boxA.height < boxB.y ||
                boxB.y + boxB.height < boxA.y);
        };

        const canvasBox: IBoundingBox = {
            x: 0,
            y: 0,
            width: this._canvas.width,
            height: this._canvas.height
        }

        const isBoxOutsideCanvas = (boundingBox.x + boundingBox.width) > canvasBox.width ||
            boundingBox.x < 0 ||
            (boundingBox.y + boundingBox.height) > canvasBox.height ||
            boundingBox.y < 0;

        return isBoxOutsideCanvas || this._occupiedBoundingBoxes.some(occupiedBox => doBoxesOverlap(boundingBox, occupiedBox));
    }

    private _getFontSize(wordWeight: number): number {
        const weights = this.words.map(w => w.weight);
        const minWeight: number = Math.min(...weights);
        const maxWeight: number = Math.max(...weights);
        const weightDiff = maxWeight - minWeight;
        const factor = (wordWeight - minWeight) / weightDiff;
        const fontSize = ((this._fontSizes.max - this._fontSizes.min) * factor) + this._fontSizes.min;

        return Math.round(fontSize);
    }

    private _drawSpiral() {
        /**
         * Start at center
         */
        let currentPoint = {
            x: this._canvas.width / 2,
            y: this._canvas.height / 2
        };

        this._ctx.beginPath();

        let frame = 1;

        const spiral = (i: number) => {
            const factor = 0.3;
            const aspectRatio = this._canvas.width / this._canvas.height;
            const angle = this._gridResolution * i;
            currentPoint.x += (1 + angle) * Math.cos(angle) * factor * aspectRatio;
            currentPoint.y += (1 + angle) * Math.sin(angle) * factor;

            this._grid = this._grid.concat({
                x: currentPoint.x,
                y: currentPoint.y
            });
            this._ctx.fillStyle = 'red';
            this._ctx.fillRect(currentPoint.x, currentPoint.y, 2, 2);
        }

        const t1 = performance.now();

        while (!this._outOfBounds(currentPoint.x, currentPoint.y)) {
            spiral(frame);
            frame += 1;
        }

        console.log(`Spiral generated in ${performance.now() - t1}ms`);
        console.log('Grid size', this._grid.length);
    }

    private _outOfBounds(x: number, y: number): boolean {
        const outBottomLeft = x < 0 && y > this._canvas.height;
        const outTopLeft = x < 0 && y < 0;
        const outTopRight = x > this._canvas.width && y < 0;
        const outBottomRight = x > this._canvas.width && y > this._canvas.height;

        return outBottomLeft || outTopLeft || outTopRight || outBottomRight;
    }
}