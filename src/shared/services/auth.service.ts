import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  User,
  onAuthStateChanged,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;
  private currentUser: User | null = null;

  constructor() {
    this.auth = getAuth();
    this.initAuthState();
  }

  private initAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async waitForAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      });
    });
  }

  // Registro de usuario
  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Inicio de sesión
  async signIn(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true; // Inicio de sesión exitoso
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return false; // Inicio de sesión fallido
    }
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
    } catch (error) {
      throw error;
    }
  }

  // Estado de autenticación
  getCurrentUser() {
    return this.currentUser;
  }
}
