import { IWord } from "./IWord";

export type IWordWithFontSize<T extends IWord> = T & {
    fontSize: number;
}