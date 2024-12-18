import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books.component';

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
  },
  {
    path: ':id/:mod',
    loadChildren: () =>
      import('./pages/guardar-book/guardar-book.module').then(
        (m) => m.GuardarBookModule
      ),
  },
];

export const BooksRoutes = RouterModule.forChild(routes);
