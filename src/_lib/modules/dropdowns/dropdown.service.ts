import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class DropdownService {

    private _toggle$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public toggle$: Observable<boolean> = this._toggle$.asObservable();

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

    isHTMLElementContainedIn(element: HTMLElement, array?: HTMLElement[]): boolean {
        return array ? array.some(item => item.contains(element)) : false;
    }

}