import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API_URL = 'https://api-node-rentify.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  /**
  * Logs in a user by sending their credentials to the server.
  */
  signIn(user: { email: string; password: string; }) {
    return this.http.post<{ token: string, role: string, id: string, name: string }>(
      `${this.AUTH_API_URL}/signInUsers`,
      user
    ).pipe(
      tap((response) => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('role', response.role);
      }),
      catchError(error => {
        console.error("Error en inicio de sesión:", error);
        return of(null);
      })
    );
  }

  /**
 * Creates a new admin user by sending their credentials to the server.
 */
  signUpAdmin(user: { email: string; password: string; }) {
    return this.http.post<any>(this.AUTH_API_URL + '/signUpAdmin', user);
  }

  /**
  * Creates a new client user by sending their credentials to the server.
  */
  signUpClient(user: { email: string; password: string; }) {
    return this.http.post<any>(this.AUTH_API_URL + '/signUpClient', user);
  }


  
  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    this.router.navigateByUrl('/home', { skipLocationChange: true });
  }
}
