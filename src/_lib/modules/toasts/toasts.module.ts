import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastsComponent } from './toasts.component';
import { ToastsService } from "./toasts.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ToastsService],
  declarations: [ToastsComponent],
  entryComponents: [ToastsComponent]
})
export class ToastsModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastsModule,
      providers: [ToastsService]
    }
  }
}
