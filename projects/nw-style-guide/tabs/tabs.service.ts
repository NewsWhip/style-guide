import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { TabDirective } from ".";

@Injectable()
export class TabsService {

    private _activeChange: Subject<TabDirective> = new Subject();
    public activeChange: Observable<TabDirective> = this._activeChange.asObservable();

    notifyActiveChange(tab: TabDirective) {
        this._activeChange.next(tab);
    }
}
