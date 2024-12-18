import { Routes, RouterModule } from '@angular/router';
import { GuardarBookComponent } from './guardar-book.component';

const routes: Routes = [
  {
    path: '',
    component: GuardarBookComponent,
  },
];

export const GuardarBookRoutes = RouterModule.forChild(routes);
