export interface IFeatureAlertParams{
    id: string;
    title: string;
    message: string;
    containerClass: string;
    triggers: string;         // (space separated) (if separated with : 1st shows popover, 2nd hides popover) mouseenter:mouseleave focus click dblclick keypress:focusout
    placement: string;
    container?: string;    // '' or 'body' or any other DOM container
}
