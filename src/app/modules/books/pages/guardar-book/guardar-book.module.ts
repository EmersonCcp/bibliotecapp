import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuardarBookComponent } from './guardar-book.component';
import { SharedModule } from 'src/shared/shared.module';
import { GuardarBookRoutes } from './guardar-book.routing';

@NgModule({
  imports: [CommonModule, SharedModule, GuardarBookRoutes],
  declarations: [GuardarBookComponent],
})
export class GuardarBookModule {}
