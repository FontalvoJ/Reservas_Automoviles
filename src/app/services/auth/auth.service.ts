import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL_CREDENCIAIS = 'https://api-node-rentify.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  
  signIn(user: { email: string; password: string; }) {
    return this.http.post<{ token: string, role: string, id: string, name: string }>(
      `${this.URL_CREDENCIAIS}/signInUsers`,
      user
    );
  }

  // Verifica si el usuario está autenticado
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtiene el token de autenticación
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Cierra la sesión del usuario
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/home', { skipLocationChange: true });
  }
}
