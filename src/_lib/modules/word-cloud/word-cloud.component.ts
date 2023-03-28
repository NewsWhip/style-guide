import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from "@angular/core";
import { IBoundingBox } from "./models/IBoundingBox";
import { IPoint } from "./models/IPoint";
import { IWordCloudConfig } from "./models/IWordCloudConfig";
import { IWord } from "./models/IWord";
import { IWordWithFontSize } from "./models/IWordWithFontSize";
import { IWordWithPosition } from "./models/IWordWithPosition";

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
 * - use CSS variables for exportColor
 */
export class WordCloudComponent<T extends IWord> implements OnChanges {

    @Input() words: T[];
    @Input() options: Partial<IWordCloudConfig> = {};

    @Output() wordsPositioned: EventEmitter<IWordWithPosition<T>[]> = new EventEmitter();

    private _wordsWithFontSize: IWordWithFontSize<T>[];
    private _positionedWords: IWordWithPosition<T>[];
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

    /**
     * Exports the canvas to a PNG image and returns the base64-encoded PNG data
     * @returns A string containing the base64-encoded PNG data of the canvas
     */
    public exportCanvas(): string {
        /**
         * Create a new canvas matching the dimensions of the original canvas. At this point, `_positionedWords` contains
         * the final positions of the words and we have no need to check for intersections, so we loop through our words
         * and draw them on our `exportCanvas`
         */
        const exportCanvas = this._renderer.createElement('canvas') as HTMLCanvasElement;
        const exportCtx = exportCanvas.getContext('2d');
        exportCanvas.width = this._canvas.width;
        exportCanvas.height = this._canvas.height;

        this._positionedWords.forEach(pw => {
            const gridPoint: IPoint = { x: pw.canvasX, y: pw.canvasY };
            this._setFontDetails(exportCtx, pw.fontSize);
            this._drawWord(pw, gridPoint, exportCtx);
        });

        return exportCanvas.toDataURL('image/png');
    }

    private _init(): void {
        this._config = this._getConfig();
        this._wordsWithFontSize = this._getWordsWithFontSize(this.words);
        this._positionedWords = [];
        this._drawCanvas();
        this._centerPoint = { x: this._canvas.width / 2, y: this._canvas.height / 2 };
        this._positionWords();

        if (this._config.debugMode) {
            console.info('Config', this._config);
            this._drawSprial();
        }
    }

    private _getWordsWithFontSize(words: T[]): IWordWithFontSize<T>[] {
        const weights = words.map(w => w.weight);
        const minWeight: number = Math.min(...weights);
        const maxWeight: number = Math.max(...weights);

        return words.map(word => {
            return {
                ...word,
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

    /**
     * This method is responsible for positioning the words onto a canvas by iterating through each word, finding a suitable location for
     * it using a spiral algorithm, and checking if the word's bounding box intersects with any existing bounding boxes
     */
    private _positionWords(): void {
        const t1 = performance.now();

        /**
         * Sets the font details, places the word on the spiral, and calculates the bounding box of the word based on its font size. If the
         * bounding box intersects with another bounding box, the index is incremented and we try to place it again
         */
        const positionWord = (wordWithFontSize: IWordWithFontSize<T>, index: number = 0) => {
            this._setFontDetails(this._ctx, wordWithFontSize.fontSize);

            const gridPoint = this._placeOnSpiral(index);
            const metrics = this._ctx.measureText(wordWithFontSize.value);
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
                return positionWord(wordWithFontSize, index + 1);
            }

            this._positionedWords = this._positionedWords.concat({
                ...boundingBox,
                ...wordWithFontSize,
                canvasX: gridPoint.x,
                canvasY: gridPoint.y
            });

            if (this._config.debugMode) {
                this._ctx.strokeStyle = 'blue';
                this._ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
                this._drawWord(wordWithFontSize, gridPoint, this._ctx);
            }
        };

        this._wordsWithFontSize.forEach(word => {
            positionWord(word);
        });

        this._positionedWords = this._scalePositionedWords(this._positionedWords);

        /**
         * Sort words before emitting so that a trackBy function will work correctly with the collection
         */
        const sortedWords = this._positionedWords.sort((a, b) => a.value.localeCompare(b.value))
        this.wordsPositioned.emit(sortedWords);

        if (this._config.debugMode) {
            console.info(`Words positioned on sprial in ${performance.now() - t1}ms`);
        }
    }

    private _drawWord(wordWithFontSize: IWordWithFontSize<T>, gridPoint: IPoint, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = wordWithFontSize.exportColor;
        ctx.fillText(wordWithFontSize.value, gridPoint.x, gridPoint.y);
    }

    private _setFontDetails(ctx: CanvasRenderingContext2D, fontSize: number): void {
        ctx.font = `${this._config.fontWeight} ${fontSize}px/1 ${this._config.fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }

    private _isIntersecting(boundingBox: IBoundingBox): boolean {
        /**
         * Check whether or not two bounding boxes overlap
         */
        const doBoxesOverlap = (boxA: IBoundingBox, boxB: IBoundingBox): boolean => {
            return !(boxA.x + boxA.width < boxB.x ||
                boxB.x + boxB.width < boxA.x ||
                boxA.y + boxA.height < boxB.y ||
                boxB.y + boxB.height < boxA.y);
        };

        /**
         * Check if any bounding boxes overlap
         */
        return this._positionedWords.some(word => doBoxesOverlap(boundingBox, word));
    }

    /**
     * Calculate the font size for a given word weight based on the minimum and maximum weights and the minimum and maximum font sizes
     * defined in the word cloud configuration object
     */
    private _getFontSize(wordWeight: number, minWeight: number, maxWeight: number): number {
        const weightDiff = maxWeight - minWeight;
        const factor = (wordWeight - minWeight) / weightDiff;
        const fontSize = ((this._config.maxFontSize - this._config.minFontSize) * factor) + this._config.minFontSize;

        return Math.round(fontSize);
    }

    /**
     * @description This method is used to place a point on a spiral based on the input n. It calculates the coordinates of the
     * point on the spiral using the spiral helper function and returns an object of type IPoint. The spiral is defined using a combination
     * of trigonometric functions and aspects such as factor, aspectRatio, and angle.
     *
     * @returns An object of type `IPoint` with `x` and `y` properties
     */
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

    /**
     * Retrieve the word cloud configuration object by merging default values with any options passed to this component instance
     */
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

    /**
     * Determine the amount of overflow for the words that have been placed outside the canvas, calculate the scaling factor for repositioning these
     * words back inside the canvas, and update and return the placed words with the scaling factor applied
     */
    private _scalePositionedWords(positionedWords: IWordWithPosition<T>[]): IWordWithPosition<T>[] {
        const outOfBounds = positionedWords.filter(word => this._isOutsideCanvas(word, this._canvas.width, this._canvas.height));

        /**
         * Determine the minimum and maximum x-coordinates of the words that are outside the canvas. The minimum x-coordinate is the leftmost
         * point of any out-of-bounds word, and the maximum x-coordinate is the rightmost point of any out-of-bounds word
         */
        const minX = Math.min(...outOfBounds.map(oob => oob.x));
        const maxX = Math.max(...outOfBounds.map(oob => oob.x + oob.width));
        /**
         * Calculate the amount of overflow for the words that are outside the canvas. `overflowLeft` is the amount by which the out-of-bounds words
         * exceed the left edge of the canvas, and `overflowRight` is the amount by which they exceed the right edge of the canvas
         */
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

        return this._positionedWords.map(pw => {
            const translateX = overflowLeft * xScale;
            const translateY = overflowTop * yScale;

            return {
                ...pw,
                canvasX: (pw.canvasX * xScale) + translateX,
                canvasY: (pw.canvasY * yScale) + translateY,
                x: (pw.x * xScale) + translateX,
                y: (pw.y * yScale) + translateY,
                width: pw.width * xScale,
                height: pw.height * yScale,
                fontSize: pw.fontSize * xScale
            }
        });
    }
}