import { IWord } from "./IWord";

export type IWordWithPosition<T extends IWord> = T & {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
}