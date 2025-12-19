import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from './autofocus.directive';

@NgModule({
    imports: [
        CommonModule,
        AutoFocusDirective
    ],
    exports: [AutoFocusDirective]
})
export class AutoFocusModule { }
