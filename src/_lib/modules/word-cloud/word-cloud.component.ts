import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { IBoundingBox } from "./models/IBoundingBox";
import { IPoint } from "./models/IPoint";
import { IWordCloudConfig } from "./models/IWordCloudConfig";
import { IWord } from "./models/IWord";
import { IWordWithFontSize } from "./models/IWordWithFontSize";
import { IWordWithPosition } from "./models/IWordWithPosition";
import { interval, Observable, of } from "rxjs";
import { catchError, filter, map, startWith, take, timeout } from "rxjs/operators";

@Component({
    selector: 'nw-word-cloud',
    templateUrl: './word-cloud.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordCloudComponent<T extends IWord> implements OnChanges {

    @Input() words: T[];
    @Input() options: Partial<IWordCloudConfig> = {};

    @Output() wordsPositioned: EventEmitter<IWordWithPosition<T>[]> = new EventEmitter();

    private _truncatedWordsWithFontSize: IWordWithFontSize<T>[];
    private _positionedWords: IWordWithPosition<T>[];
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _centerPoint: IPoint;
    /**
     * Controls how many points are generated on the spiral. Should be kept between 0 and 1. Lower values generate more
     * points on the spiral but it can take a lot longer to position the words. If updating this value to <= 0.3, consider
     * all the places where this is used and for each one the amount of words in the cloud. It could also be a good idea to
     * make this value configurable by allowing it to be specified in the `options` input
     */
    private _spiralResolution = 0.3;

    public config: IWordCloudConfig;

    constructor(
        private _elRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        private _cdRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: Document,
        public elRef: ElementRef<HTMLElement>) {}

    ngOnChanges(changes: SimpleChanges): void {
        const wordsChange = changes.words?.currentValue !== changes.words?.previousValue;
        const optionsChange = changes.options?.currentValue !== changes.options?.previousValue;

        if (wordsChange || optionsChange) {
            this._init();
        }
    }

    /**
     * Exports the canvas to a PNG image and returns the base64-encoded PNG data
     * @returns A string containing the base64-encoded PNG data of the canvas
     */
    exportCanvas(): string {
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
            const point: IPoint = { x: pw.canvasX, y: pw.canvasY };
            this._setFontDetails(exportCtx, pw.fontSize);
            this._drawWord(pw, point, exportCtx);
        });

        return exportCanvas.toDataURL('image/png');
    }

    downloadCanvas(filename: string): void {
        const dataUrl = this.exportCanvas();
        const link = document.createElement('a');

        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
    }

    onResize() {
        this._init();
    }

    private _init(): void {
        this.config = this._getConfig();
        this._truncatedWordsWithFontSize = this._getTruncatedWordsWithFontSize(this.words);
        this._positionedWords = [];
        this._drawCanvas();
        this._centerPoint = { x: this._canvas.width / 2, y: this._canvas.height / 2 };

        this._isFontLoaded().subscribe(() => {
            this._positionWords();
    
            if (this.config.debugMode) {
                console.info('Config', this.config);
                this._drawSprial();
            }

            this._cdRef.detectChanges();
        });
    }

    /**
     * Calculates the font size for each word based on its weight and the range of weights in the list of words
     * @param words List of words with their respective weights
     * @returns A new list of words sorted by weight (largest to smallest) with their respective font sizes
     */
    private _getTruncatedWordsWithFontSize(words: T[]): IWordWithFontSize<T>[] {
        const weights = words.map(w => w.weight);
        const minWeight: number = Math.min(...weights);
        const maxWeight: number = Math.max(...weights);

        return words.map(word => {
            return {
                ...word,
                fontSize: this._getFontSize(word.weight, minWeight, maxWeight),
                truncatedValue: this._truncateWord(word.value)
            };
        }).sort((a, b) => b.weight - a.weight);
    }

    private _drawCanvas(): void {
        this._canvas = this._canvas || this._renderer.createElement('canvas');
        this._canvas.width = this._elRef.nativeElement.parentElement.clientWidth;
        this._canvas.height = this._elRef.nativeElement.parentElement.clientHeight;
        this._ctx = this._canvas.getContext('2d');

        if (this.config.debugMode) {
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

            const point = this._placeOnSpiral(index);
            const metrics = this._ctx.measureText(wordWithFontSize.truncatedValue);
            const fontHeight = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 1.1;
            const { paddingX, paddingY } = this.config;
            const width = metrics.width + paddingX;
            const height = fontHeight + paddingY;

            /**
             * Adjust the x and y based on textAlign = "center" and textBaseline = "middle";
             */
            const boundingBox: IBoundingBox = {
                x: point.x - (width / 2),
                y: point.y - (height / 2),
                width,
                height
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
                canvasX: point.x,
                canvasY: point.y
            });

            if (this.config.debugMode) {
                this._ctx.strokeStyle = 'blue';
                this._ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
                this._drawWord(wordWithFontSize, point, this._ctx);
            }
        };

        this._truncatedWordsWithFontSize.forEach(word => {
            positionWord(word);
        });

        this._positionedWords = this._scalePositionedWords(this._positionedWords);

        /**
         * Sort words before emitting so that a trackBy function will work correctly with the collection
         */
        const sortedWords = this._positionedWords.sort((a, b) => a.value.localeCompare(b.value))
        this.wordsPositioned.emit(sortedWords);

        if (this.config.debugMode) {
            console.info(`Words positioned on sprial in ${performance.now() - t1}ms`);
        }
    }

    private _truncateWord(value: string): string {
        if (value.length > this.config.maxCharCount) {
            return value.substring(0, this.config.maxCharCount) + '...'
        }
        return value;
    }

    private _drawWord(wordWithFontSize: IWordWithFontSize<T>, point: IPoint, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = wordWithFontSize.exportColor;
        ctx.fillText(wordWithFontSize.truncatedValue, point.x, point.y);
    }

    private _setFontDetails(ctx: CanvasRenderingContext2D, fontSize: number): void {
        ctx.font = `${this.config.fontWeight} ${fontSize}px/1 ${this.config.fontFamily}`;
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
        const fontSize = ((this.config.maxFontSize - this.config.minFontSize) * factor) + this.config.minFontSize;

        /**
         * fontSize may be NaN if all words have the same weight. If they do, return the fontSize that is midway
         * between the minFontSize and the maxFontSize
         */
        if (fontSize) {
            return Math.round(fontSize);
        }
        return Math.round((this.config.minFontSize + this.config.maxFontSize) / 2);
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
            const aspectRatio = this._canvas.width / this._canvas.height;
            const angle = i;
            const x = this._centerPoint.x + (1 + angle) * Math.cos(angle) * this._spiralResolution * aspectRatio;
            const y = this._centerPoint.y + (1 + angle) * Math.sin(angle) * this._spiralResolution;

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
            maxFontSize: 48,
            minFontSize: 16,
            paddingX: 8,
            paddingY: 8,
            maxCharCount: 20,
            resizeTolerance: 0
        }

        return {
            ...defaultConfig,
            ...this.options
        };
    }

    private _drawSprial(): void {
        this._ctx.save();
        this._ctx.fillStyle = 'white';

        for (let i = 0; i < 3000; i++) {
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
        /**
         * Find the largest horizontal overflow and double it. As we're scaling towards the center, rather than summing the left
         * and right overflows we need to take the largest and double it to ensure we don't end up with words being positioned out
         * of bounds on the x-axis
         */
        const overflowX = Math.max(overflowLeft, overflowRight) * 2;
        const xScale = this._canvas.width / (this._canvas.width + overflowX);

        if (this.config.debugMode) {
            console.info(`minX: ${minX}, maxX: ${maxX}, overflowX: ${overflowX}, xScale: ${xScale}`);
        }

        /**
         * Determine the minimum and maximum y-coordinates of the words that are outside the canvas. The minimum y-coordinate is the topmost
         * point of any out-of-bounds word, and the maximum Y-coordinate is the bottom-most point of any out-of-bounds word
         */
        const minY = Math.min(...outOfBounds.map(oob => oob.y));
        const maxY = Math.max(...outOfBounds.map(oob => oob.y + oob.height));
        const overflowTop = minY < 0 ? Math.abs(minY) : 0;
        const overflowBottom = maxY > this._canvas.height ? (maxY - this._canvas.height) : 0;
        /**
         * Find the largest vertical overflow and double it. As we're scaling towards the center, rather than summing the top
         * and bottom overflows we need to take the largest and double it to ensure we don't end up with words being positioned out
         * of bounds on the y-axis
         */
        const overflowY = Math.max(overflowTop, overflowBottom) * 2;
        const yScale = this._canvas.height / (this._canvas.height + overflowY);
        const minScale = Math.min(xScale, yScale);

        if (this.config.debugMode) {
            console.info(`minY: ${minY}, maxY: ${maxY}, overflowY: ${overflowY}, yScale: ${yScale}`);
        }

        const moveTowardsCenter = (x: number, y: number, height: number, scale: number) => {
            const scaledHeightOffset = (height / 4) * scale;
            const dx = this._centerPoint.x - x;
            const dy = this._centerPoint.y - y + scaledHeightOffset;
            /**
             * Determine the distance between the current position and the target position (the center) and
             * multiply it by our scale (between 0 and 1) to move partway towards the target
             */
            const dist = Math.sqrt((dx * dx) + (dy * dy)) * (1 - scale);
            /**
             * Calculate the angle at which we should move and the update our x and y using our calculated distance and angle
             *
             * ref: https://stackoverflow.com/a/5995931/1128290
             */
            const angle = Math.atan2(dy, dx);

            return {
                x: x + (dist * Math.cos(angle)),
                y: y + (dist * Math.sin(angle))
            };
        }

        return this._positionedWords.map(pw => {
            const { x, y } = moveTowardsCenter(pw.x, pw.y, pw.height, minScale);
            const { x: canvasX, y: canvasY } = moveTowardsCenter(pw.canvasX, pw.canvasY, pw.height, minScale);
            const width = pw.width * minScale;
            const height = pw.height * minScale;
            const fontSize = pw.fontSize * minScale;

            return {
                ...pw,
                canvasX,
                canvasY,
                x,
                y,
                width,
                height,
                fontSize
            }
        });
    }

    private _isFontLoaded(): Observable<{ isLoaded: boolean }> {
        const fontTimeout = 5000;
        /**
         * Needs to be a valid font string
         * ref: https://developer.mozilla.org/en-US/docs/Web/CSS/font
         */
        const fontString = `${this.config.fontWeight} 12px ${this.config.fontFamily}`;

        return interval(250).pipe(
            startWith(0),
            map(_x => this._document.fonts.check(fontString)),
            filter(isLoaded => isLoaded),
            map(isLoaded => ({ isLoaded })),
            take(1),
            timeout(fontTimeout),
            catchError(_e => {
                console.warn(`The font "${fontString}" failed to load within ${fontTimeout}ms`);
                return of({ isLoaded: false });
            })
        )
    }
}