import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from 'src/shared/guards/login.guard';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books.module').then((m) => m.BooksModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [LoginGuard],
  },

  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
