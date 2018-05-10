export interface IFeatureAlertParams {
    id: string;                 // unique id that will be stored in the local storage
    title: string;
    message: string;
    placement: string;
    containerClass?: string;     // all feature alerts have .feature-alert, you can add more classes
    triggers?: string;           // (space separated) mouseenter focus click dblclick keypress
    container?: string;          // '' or 'body' or any other DOM container
    isBlockEl?: boolean;         // true if feature alert anchor is a block element
}
