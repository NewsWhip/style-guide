import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2 } from "@angular/core";

@Component({
    selector: 'nw-word-cloud',
    templateUrl: './word-cloud.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    styles: [`
        canvas{
            background-color: white;
        }
    `]
})
/**
 * - create canvas that fills the height and width of the parent element
 * - first randomly place words
 * - then size the words based on their weight / frequency
 */
export class WordCloudComponent implements OnInit {

    private _fontSizes = {
        min: 15,
        max: 50
    };
    private _inputWords: { value: string; weight: number }[];
    private _words: IWordDetails[];
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _grid: Array<IGridPoint[]> = [];
    private _gridResolution = 1;

    constructor(
        private _elRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2) {}

    ngOnInit() {
        this._inputWords = this._generateInputWords();
        this._drawCanvas();
        // this._createGrid();
        // this._drawGrid(this._grid);
        this._words = this._getWords();
        this._placeWords();
        this._drawSpiral();
    }

    private _generateInputWords() {
        const words = ["words", "are", "cool", "and", "so", "are", "you", "inconstituent", "funhouse!", "apart", "from", "Steve", "fish"];

        return words.map(value => {
            return {
                value,
                weight: Math.floor(Math.random() * 50)
            };
        })
    }

    private _getWords(): IWordDetails[] {
        return this._inputWords.map(word => {
            return {
                value: word.value,
                weight: word.weight,
                fontSize: this._getFontSize(word.weight)
            };
        }).sort((a, b) => a.weight - b.weight);
    }

    private _drawCanvas() {
        this._canvas = this._renderer.createElement('canvas');
        this._canvas.width = this._elRef.nativeElement.parentElement.clientWidth;
        this._canvas.height = this._elRef.nativeElement.parentElement.clientHeight;
        this._ctx = this._canvas.getContext('2d');
        this._renderer.appendChild(this._elRef.nativeElement, this._canvas);
    }

    private _createGrid() {
        for (let row = this._gridResolution; row < this._canvas.width; row += this._gridResolution) {
            this._grid[row] = [];

            for (let column = this._gridResolution; column < this._canvas.height; column += this._gridResolution) {
                this._grid[row] = this._grid[row].concat({
                    x: row,
                    y: column
                });
            }
        }
    }

    private _drawGrid(grid: Array<IGridPoint[]>) {
        grid.flat().forEach(point => {
            this._ctx.beginPath();
            this._ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            this._ctx.fillStyle = 'black';
            this._ctx.fill();
        });
    }

    private _placeWords() {
        const getRandomPosition = () => {
            return {
                x: Math.random() * this._canvas.width,
                y: Math.random() * this._canvas.height
            };
        }

        this._words.forEach(word => {
            const { x, y } = getRandomPosition();

            this._ctx.font = `normal ${word.fontSize}px ProximaNova`;
            this._ctx.fillText(word.value, x, y);
        });
    }

    private _getFontSize(wordWeight: number): number {
        const weights = this._inputWords.map(w => w.weight);
        const minWeight: number = Math.min(...weights);
        const maxWeight: number = Math.max(...weights);
        const weightDiff = maxWeight - minWeight;
        const factor = (wordWeight - minWeight) / weightDiff;
        const fontSize = ((this._fontSizes.max - this._fontSizes.min) * factor) + this._fontSizes.min;

        return Math.round(fontSize);
    }

    private _drawSpiral() {
        const outOfBounds = (x: number, y: number): boolean => {
            const outBottomLeft = x < 0 && y > this._canvas.height;
            const outTopLeft = x < 0 && y < 0;
            const outTopRight = x > this._canvas.width && y < 0;
            const outBottomRight = x > this._canvas.width && y > this._canvas.height;

            return outBottomLeft || outTopLeft || outTopRight || outBottomRight;
        }

        /**
         * Start at center
         */
        let currentPoint = {
            x: this._canvas.width / 2,
            y: this._canvas.height / 2
        };

        this._ctx.beginPath();

        let frame = 1;
        let grid = [];

        const spiral = (i: number) => {
            const angle = this._gridResolution * i;
            currentPoint.x += (1 + angle) * Math.cos(angle);
            currentPoint.y += (1 + angle) * Math.sin(angle);

            grid.push([currentPoint.x, currentPoint.y]);
            this._ctx.fillStyle = 'red';
            this._ctx.fillRect(currentPoint.x, currentPoint.y, 2, 2);
        }

        const t1 = performance.now();

        while (!outOfBounds(currentPoint.x, currentPoint.y)) {
            spiral(frame);
            frame += 1;
        }

        console.log(`Spiral generated in ${performance.now() - t1}ms`);
    }
}

export interface IWordDetails {
    value: string;
    weight: number;
    fontSize: number;
}

export interface IGridPoint {
    x: number;
    y: number;
}