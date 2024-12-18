import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutes } from './categories.routing';
import { SharedModule } from 'src/shared/shared.module';
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';

@NgModule({
  imports: [CommonModule, CategoriesRoutes, SharedModule],
  declarations: [CategoriesComponent, ListCategoriesComponent],
})
export class CategoriesModule {}
