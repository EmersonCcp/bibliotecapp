import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IChangePassword, LoginResponse } from '../interfaces/auth';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiURL}/auth`;
  private tokenKey = 'token';
  private userKey = 'current_user';

  constructor(private http: HttpClient, private router: Router) {}

  login(usu_email: string, usu_password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        usu_email,
        usu_password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token!);
          this.encriptarUsuario(response.usuario);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  encriptarUsuario(usuario: any) {
    const encryptedUser = CryptoJS.AES.encrypt(
      JSON.stringify(usuario),
      environment.secretKey
    ).toString();

    localStorage.setItem(this.userKey, encryptedUser);
  }

  desencriptarUsuario() {
    const encrypted = localStorage.getItem(this.userKey);
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(encrypted, environment.secretKey);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser;
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  changePassword(dto: IChangePassword): Observable<{ok: boolean, message: string, item?: any}>{
    return this.http.post<{ok: boolean, message: string, item?: any}>(`${this.apiUrl}/change-password`, dto);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    this.router.navigate(['/auth']);
  }
}
