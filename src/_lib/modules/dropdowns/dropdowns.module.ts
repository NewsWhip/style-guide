import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from "./dropdown.directive";
import { DropdownToggleDirective } from "./dropdown-toggle.directive";
import { DropdownMenuDirective } from "./dropdown-menu.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DropdownDirective, DropdownToggleDirective, DropdownMenuDirective],
  exports: [DropdownDirective, DropdownToggleDirective, DropdownMenuDirective]
})
export class DropdownsModule { }
