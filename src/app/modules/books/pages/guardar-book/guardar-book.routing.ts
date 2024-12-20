import { Routes, RouterModule } from '@angular/router';
import { GuardarBookComponent } from './guardar-book.component';
import { AuthGuard } from 'src/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: GuardarBookComponent,
    canActivate: [AuthGuard],
  },
];

export const GuardarBookRoutes = RouterModule.forChild(routes);
