import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private API_URL = 'https://api-node-rentify.onrender.com/api/cars/';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los encabezados con el token de autenticación.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('x-access-token', token);
  }

  /**
   * Verifica si el usuario actual es administrador.
   */
  private isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }

  /**
   * Manejo genérico de errores en las solicitudes HTTP.
   */
  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);
    alert('An error occurred. Please try again.');
    return throwError(() => error);
  }

  /**
   * Crea un nuevo automóvil (solo para administradores).
   */
  createCar(carData: {
    brand: string;
    model: string;
    year: number;
    color: string;
    pricePerDay: number;
    location: string;
    power: number;
    system: string;
    accompanists: number;
  }): Observable<any> {
    if (!this.isAdmin()) {
      alert('Only admins can create cars.');
      return throwError(() => new Error('Unauthorized access'));
    }

    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.API_URL}createCar`, carData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene todos los automóviles registrados por un administrador.
   */
  getAllCarsByAdmin(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.API_URL}carsByAdmin`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}
