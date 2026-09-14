/**
 * The events and timings a callout opens and closes with. Each directive supplies these as its defaults, and the
 * base resolves them against whatever the consumer bound
 */
export interface ICalloutTriggers {
    delay: number;
    openEvents: string[];
    closeEvents: string[];
    closeOnScroll: boolean;
    pointerEvents: 'auto' | 'none';
}
