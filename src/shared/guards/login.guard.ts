import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {


  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {

      const user = this.authService.desencriptarUsuario();
      if(user && user.usu_codigo) {
        this.router.navigate(['/books']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }
}
