import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule]
})
export class TablesComponent {
    public isTall: boolean = false;
}
