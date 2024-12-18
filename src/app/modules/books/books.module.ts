import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './books.component';
import { BooksRoutes } from './books.routing';
import { ListBooksComponent } from './components/list-books/list-books.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [CommonModule, BooksRoutes, SharedModule],
  declarations: [BooksComponent, ListBooksComponent],
})
export class BooksModule {}
