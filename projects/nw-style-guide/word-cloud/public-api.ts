export { IWord } from './models/IWord';
export { IWordWithPosition } from './models/IWordWithPosition';
export { IWordCloudConfig } from './models/IWordCloudConfig';
export { WordCloudComponent } from './word-cloud.component';
export { WordComponent } from './word.component';

import { WordCloudComponent } from './word-cloud.component';
import { WordComponent } from './word.component';

export const WORD_CLOUD_COMPONENTS = [
    WordCloudComponent,
    WordComponent
] as const;