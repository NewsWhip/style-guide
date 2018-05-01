export interface IFeatureAlertParams {
    id: string;                 // unique id that will be stored in the local storage
    title: string;
    message: string;
    containerClass: string;     // all feature alerts share .feature-alert class but you can add more
    triggers: string;           // (space separated) mouseenter focus click dblclick keypress
    placement: string;
    container?: string;         // '' or 'body' or any other DOM container
}
