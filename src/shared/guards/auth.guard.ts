import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {

      const user = this.authService.desencriptarUsuario();
      if(user && user.usu_codigo) {
        resolve(true);
      } else {
        this.router.navigate(['/auth']);
          resolve(false);
      }
    });
  }
}
