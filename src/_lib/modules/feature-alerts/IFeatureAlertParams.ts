export interface IFeatureAlertParams {
    id: string;                 // unique id that will be stored in the local storage
    title: string;
    message: string;
    placement: string;
    containerClass?: string;     // all feature alerts share .feature-alert class but you can add more
                                 // classes to it - they need to be defined in global styles though
    triggers?: string;           // (space separated) mouseenter focus click dblclick keypress
    container?: string;          // '' or 'body' or any other DOM container
    isBlockEl?: boolean;         // true if feature alert anchor is a block element
}
