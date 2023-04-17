import { IWord } from "./IWord";
import { IWordWithFontSize } from "./IWordWithFontSize";

export type IWordWithPosition<T extends IWord> = T & IWordWithFontSize<T> & {
    canvasX: number;
    canvasY: number;
    x: number;
    y: number;
    width: number;
    height: number;
}