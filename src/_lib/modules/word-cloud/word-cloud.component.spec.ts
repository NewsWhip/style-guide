import { DebugElement, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IBoundingBox } from "./models/IBoundingBox";
import { IWord } from "./models/IWord";
import { IWordWithPosition } from "./models/IWordWithPosition";
import { WordCloudComponent } from "./word-cloud.component";

interface IMyWord extends IWord {
    id: number;
}

fdescribe('WordCloudComponent', () => {
    let comp: WordCloudComponent<IMyWord>;
    let fixture: ComponentFixture<WordCloudComponent<IMyWord>>;
    let de: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                WordCloudComponent
            ]
        });
        fixture = TestBed.createComponent(WordCloudComponent<IMyWord>);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
        comp.words = [];
    });

    describe('_getFontSize', () => {
        it('should return minFontSize when wordWeight is equal to minWeight', () => {
            const minWeight = 0;
            const maxWeight = 100;
            const wordWeight = 0;

            comp.ngOnChanges({
                words: new SimpleChange(undefined, [], true)
            });
            fixture.detectChanges();


            expect(comp['_getFontSize'](wordWeight, minWeight, maxWeight)).toEqual(10);
        });

        it('should return maxFontSize when wordWeight is equal to maxWeight', () => {
            const minWeight = 0;
            const maxWeight = 100;
            const wordWeight = 100;

            comp.ngOnChanges({
                words: new SimpleChange(undefined, [], true)
            });
            fixture.detectChanges();


            expect(comp['_getFontSize'](wordWeight, minWeight, maxWeight)).toEqual(60);
        });

        it('should return a font size between minFontSize and maxFontSize when wordWeight is between minWeight and maxWeight', () => {
            const minWeight = 0;
            const maxWeight = 100;
            const wordWeight = 50;

            comp.ngOnChanges({
                words: new SimpleChange(undefined, [], true)
            });
            fixture.detectChanges();

            const fontSize = comp['_getFontSize'](wordWeight, minWeight, maxWeight);

            expect(fontSize).toBeGreaterThanOrEqual(12);
            expect(fontSize).toBeLessThanOrEqual(60);
        });
    });

    describe('_isIntersecting', () => {
        it('should return false if bounding box does not overlap with any other bounding boxes', () => {
            const boundingBox: IBoundingBox = { x: 0, y: 0, width: 10, height: 10 };
            comp['_positionedWords'] = [
                { x: 20, y: 20, width: 10, height: 10 },
                { x: 30, y: 30, width: 10, height: 10 },
                { x: 40, y: 40, width: 10, height: 10 },
            ] as IWordWithPosition<any>;
            const result = comp['_isIntersecting'](boundingBox);
            expect(result).toBe(false);
        });

        it('should return true if bounding box overlaps with at least one other bounding box', () => {
            const boundingBox: IBoundingBox = { x: 10, y: 10, width: 20, height: 20 };
            comp['_positionedWords'] = [
                { x: 0, y: 0, width: 10, height: 10 },
                { x: 30, y: 30, width: 10, height: 10 },
                { x: 10, y: 15, width: 10, height: 10 },
            ] as IWordWithPosition<any>;
            const result = comp['_isIntersecting'](boundingBox);
            expect(result).toBe(true);
        });

        it('should return true if bounding box completely overlaps with another bounding box', () => {
            const boundingBox: IBoundingBox = { x: 10, y: 10, width: 20, height: 20 };
            comp['_positionedWords'] = [
                { x: 0, y: 0, width: 50, height: 50 },
                { x: 30, y: 30, width: 10, height: 10 },
            ] as IWordWithPosition<any>;
            const result = comp['_isIntersecting'](boundingBox);
            expect(result).toBe(true);
        });

        it('should return true if bounding box is completely inside another bounding box', () => {
            const boundingBox: IBoundingBox = { x: 10, y: 10, width: 5, height: 5 };
            comp['_positionedWords'] = [
                { x: 0, y: 0, width: 50, height: 50 },
                { x: 30, y: 30, width: 10, height: 10 },
            ] as IWordWithPosition<any>;
            const result = comp['_isIntersecting'](boundingBox);
            expect(result).toBe(true);
        });

        it('should return true if bounding box is partially inside another bounding box', () => {
            const boundingBox: IBoundingBox = { x: 10, y: 10, width: 20, height: 20 };
            comp['_positionedWords'] = [
                { x: 0, y: 0, width: 50, height: 50 },
                { x: 30, y: 30, width: 10, height: 10 },
                { x: 5, y: 5, width: 20, height: 20 },
            ] as IWordWithPosition<any>;
            const result = comp['_isIntersecting'](boundingBox);
            expect(result).toBe(true);
        });
    });


});