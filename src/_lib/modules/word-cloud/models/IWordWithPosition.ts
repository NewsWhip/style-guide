import { IWord } from "./IWord";

export type IWordWithPosition<T extends IWord> = T & {
    canvasX: number;
    canvasY: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
}