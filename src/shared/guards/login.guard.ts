import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // Si el usuario está autenticado, redirige a la página principal
          this.router.navigate(['/books']); // O la ruta a la que quieras redirigir
          resolve(false); // No permitir acceso al login
        } else {
          // Si no está autenticado, permitir el acceso a la ruta de login
          resolve(true);
        }
      });
    });
  }
}
