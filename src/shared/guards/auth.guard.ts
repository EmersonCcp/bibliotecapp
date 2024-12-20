import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth: Auth;

  constructor(private router: Router) {
    this.auth = getAuth();
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true); // Usuario autenticado
        } else {
          this.router.navigate(['/auth']);
          resolve(false); // Usuario no autenticado
        }
      });
    });
  }
}
