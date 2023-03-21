import { IBoundingBox } from "./IBoundingBox";
import { IWordDetails } from "./IWordDetails";

export interface IPlacedWord extends IBoundingBox {
    wordDetails: IWordDetails;
}