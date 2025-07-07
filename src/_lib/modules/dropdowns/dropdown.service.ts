import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, skip } from "rxjs";

@Injectable()
export class DropdownService {

    private _toggle$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public toggle$: Observable<boolean> = this._toggle$.asObservable().pipe(
        skip(1)
    );

    public autoClose: boolean | "inside" | "outside";

    toggle() {
        this._toggle$.next(!this._toggle$.value);
    }

    open() {
        this._toggle$.next(true);
    }

    close() {
        this._toggle$.next(false);
    }

    isHTMLElementContainedIn(element: HTMLElement, containers: HTMLElement[]): boolean {
        return containers
            // Filter out falsey elements
            .filter(el => el)
            .some(item => item.contains(element));
    }

    isHTMLElementInPath(event: any, selectors: string[]) {
        // Obtain the path from the event source to the document root
        const path: HTMLElement[] = (event.path || (event.composedPath && event.composedPath()) as HTMLElement[]);

        return path
            // Map to parentNode so we can use querySelector
            .map(el => el.parentNode as HTMLElement)
            // Filter out undefined parent nodes
            .filter(p => p)
            // Check if any of the parentNodes match any of the selectors
            .some(p => selectors.some(s => Boolean(p.querySelector(s))));
    }
}
