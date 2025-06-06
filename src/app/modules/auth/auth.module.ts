import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutes } from './auth.routing';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [CommonModule, AuthRoutes, SharedModule],
  declarations: [AuthComponent, LoginComponent],
})
export class AuthModule {}
