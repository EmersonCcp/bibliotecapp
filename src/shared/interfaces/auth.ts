export interface LoginData {
  usu_codigo: number;
    usu_username?: string;
    usu_email?: string;
    usu_password: string;
  }
  
  export interface LoginResponse {
    ok: boolean;
    message?: string;
    token?: string;
    usuario?: any;
  }
  
  export interface Usuario {
    usu_codigo: number;
    usu_username: string;
    usu_email: string;
    // ... otras propiedades
  }

  export interface IChangePassword {
    usu_codigo: number;
    oldPassword: string;
    newPassword: string;
  }