import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from "@angular/core";
import { IBoundingBox } from "./models/IBoundingBox";
import { IPoint } from "./models/IPoint";
import { IPlacedWord } from "./models/IPlacedWord";
import { IWordCloudConfig } from "./models/IWordCloudConfig";
import { IWordDetails } from "./models/IWordDetails";

@Component({
    selector: 'nw-word-cloud',
    templateUrl: './word-cloud.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})
/**
 * Todos
 * - Test with very long words - DONE
 * - Don't draw a spiral - DONE
 *      - loop until all words are placed
 *      - then scale the canvas to fit all words (with padding)
 *      - adjust font-sizes based on scale
 * - issue where font may not be loaded when we're drawing to the canvas
 *      - https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check
 * - can I make it easy to export
 * - try log n scaling for font-sizes (https://www.jasondavies.com/wordcloud/)
 * - can I support multiple orientations
 */
export class WordCloudComponent implements OnChanges {

    @Input() words: { value: string; weight: number }[];
    @Input() options: Partial<IWordCloudConfig> = {};

    @Output() wordsPlaced: EventEmitter<IPlacedWord[]> = new EventEmitter();

    private _words: IWordDetails[];
    private _placedWords: IPlacedWord[];
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _centerPoint: IPoint;
    private _gridResolution = 1;
    private _config: IWordCloudConfig;

    constructor(
        private _elRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.words?.currentValue !== changes.words?.previousValue) {
            this._init();
        }
    }

    private _init(): void {
        this._config = this._getConfig();
        this._words = this._getWords();
        this._placedWords = [];
        this._drawCanvas();
        this._centerPoint = { x: this._canvas.width / 2, y: this._canvas.height / 2 };
        this._placeWords();

        if (this._config.debugMode) {
            console.info(this._config);
            this._drawSprial();
        }
    }

    private _getWords(): IWordDetails[] {
        const weights = this.words.map(w => w.weight);
        const minWeight: number = Math.min(...weights);
        const maxWeight: number = Math.max(...weights);

        return this.words.map(word => {
            return {
                value: word.value,
                weight: word.weight,
                fontSize: this._getFontSize(word.weight, minWeight, maxWeight)
            };
        }).sort((a, b) => b.weight - a.weight);
    }

    private _drawCanvas(): void {
        this._canvas = this._canvas || this._renderer.createElement('canvas');
        this._canvas.width = this._elRef.nativeElement.parentElement.clientWidth;
        this._canvas.height = this._elRef.nativeElement.parentElement.clientHeight;
        this._ctx = this._canvas.getContext('2d');

        if (this._config.debugMode) {
            this._renderer.appendChild(this._elRef.nativeElement, this._canvas);
        }
    }

    private _placeWords(): void {
        const t1 = performance.now();

        const placeWord = (wordDetails: IWordDetails, index: number = 0) => {
            this._setFontDetails(this._ctx, wordDetails.fontSize);

            const gridPoint = this._placeOnSpiral(index);
            const metrics = this._ctx.measureText(wordDetails.value);
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

            /**
             * If this bounding box intersects another bounding box, increment the index and try the next place
             */
            if (this._isIntersecting(boundingBox)) {
                return placeWord(wordDetails, index + 1);
            }

            this._placedWords = this._placedWords.concat({
                ...boundingBox,
                wordDetails
            });

            if (this._config.debugMode) {
                this._ctx.strokeStyle = 'blue';
                this._ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
                this._ctx.fillStyle = 'red';
                this._ctx.fillText(wordDetails.value, gridPoint.x, gridPoint.y);
            }
        };

        this._words.forEach(word => {
            placeWord(word);
        });

        const outOfBounds = this._placedWords.filter(word => this._isOutsideCanvas(word, this._canvas.width, this._canvas.height));

        const minX = Math.min(...outOfBounds.map(oob => oob.x));
        const maxX = Math.max(...outOfBounds.map(oob => oob.x + oob.width));
        const overflowLeft = minX < 0 ? Math.abs(minX) : 0;
        const overflowRight = maxX > this._canvas.width ? (maxX - this._canvas.width) : 0;
        const overflowX = overflowLeft + overflowRight;
        const xScale = this._canvas.width / (this._canvas.width + overflowX);

        if (this._config.debugMode) {
            console.info(`minX: ${minX}, maxX: ${maxX}, overflowX: ${overflowX}, xScale: ${xScale}`);
        }

        const minY = Math.min(...outOfBounds.map(oob => oob.y));
        const maxY = Math.max(...outOfBounds.map(oob => oob.y + oob.height));
        const overflowTop = minY < 0 ? Math.abs(minY) : 0;
        const overflowBottom = maxY > this._canvas.height ? (maxY - this._canvas.height) : 0;
        const overflowY = overflowTop + overflowBottom;
        const yScale = this._canvas.height / (this._canvas.height + overflowY);

        if (this._config.debugMode) {
            console.info(`minY: ${minY}, maxY: ${maxY}, overflowY: ${overflowY}, yScale: ${yScale}`);
        }

        this._placedWords.forEach(pw => {
            pw.x = (pw.x * xScale) + (overflowLeft * xScale);
            pw.y = (pw.y * yScale) + (overflowTop * yScale);
            pw.width = pw.width * xScale;
            pw.height = pw.height * yScale;
            pw.wordDetails.fontSize = pw.wordDetails.fontSize * xScale;
        });

        /**
         * Sort words before emitting so that a trackBy function will work correctly with the collection
         */
        const sortedWords = this._placedWords.sort((a, b) => a.wordDetails.value.localeCompare(b.wordDetails.value))
        this.wordsPlaced.emit(sortedWords);

        if (this._config.debugMode) {
            console.info(`Words placed on sprial in ${performance.now() - t1}ms`);
        }
    }

    private _setFontDetails(ctx: CanvasRenderingContext2D, fontSize: number): void {
        ctx.font = `${this._config.fontWeight} ${fontSize}px/1 ${this._config.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }

    private _isIntersecting(boundingBox: IBoundingBox): boolean {
        const doBoxesOverlap = (boxA: IBoundingBox, boxB: IBoundingBox): boolean => {
            return !(boxA.x + boxA.width < boxB.x ||
                boxB.x + boxB.width < boxA.x ||
                boxA.y + boxA.height < boxB.y ||
                boxB.y + boxB.height < boxA.y);
        };

        return this._placedWords.some(word => doBoxesOverlap(boundingBox, word));
    }

    private _getFontSize(wordWeight: number, minWeight: number, maxWeight: number): number {
        const weightDiff = maxWeight - minWeight;
        const factor = (wordWeight - minWeight) / weightDiff;
        const fontSize = ((this._config.maxFontSize - this._config.minFontSize) * factor) + this._config.minFontSize;

        return Math.round(fontSize);
    }

    private _placeOnSpiral(n: number): IPoint {
        const spiral = (i: number) => {
            const factor = 0.3;
            const aspectRatio = this._canvas.width / this._canvas.height;
            const angle = this._gridResolution * i;
            const x = this._centerPoint.x + (1 + angle) * Math.cos(angle) * factor * aspectRatio;
            const y = this._centerPoint.y + (1 + angle) * Math.sin(angle) * factor;

            return { x, y };
        }

        return spiral(n);
    }

    private _isOutsideCanvas(boundingBox: IBoundingBox, canvasWidth: number, canvasHeight: number): boolean {
        return (boundingBox.x + boundingBox.width) > canvasWidth ||
            boundingBox.x < 0 ||
            (boundingBox.y + boundingBox.height) > canvasHeight ||
            boundingBox.y < 0;
    }

    private _getConfig(): IWordCloudConfig {
        const defaultConfig: IWordCloudConfig = {
            debugMode: false,
            fontFamily: 'ProximaNova',
            fontWeight: 'normal',
            maxFontSize: 60,
            minFontSize: 10
        }

        return {
            ...defaultConfig,
            ...this.options
        };
    }

    private _drawSprial(): void {
        this._ctx.save();
        this._ctx.fillStyle = 'white';

        for (let i = 0; i < 1000; i++) {
            const { x, y } = this._placeOnSpiral(i);
            this._ctx.fillRect(x, y, 1, 1);
        }

        this._ctx.restore();
    }
}