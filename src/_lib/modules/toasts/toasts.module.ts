import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastsComponent } from './toasts.component';
import { Toaster } from "./toasts.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ToastsComponent],
  entryComponents: [ToastsComponent]
})
export class ToastsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastsModule,
      providers: [Toaster]
    }
  }
}
