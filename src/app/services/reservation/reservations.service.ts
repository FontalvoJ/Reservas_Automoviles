import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private RESERVATION_API_URL = 'https://api-node-rentify.onrender.com/api/reservations';
  

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('x-access-token', token);
  }

  createReservation(carId: string, startDate: Date, endDate: Date): Observable<any> {
    const reservationData = {
      carId: carId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    console.log('Sending reservation data:', reservationData);

    return this.http.post(`${this.RESERVATION_API_URL}/createReservation`, reservationData, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError(error => {
        console.error('Error creating reservation:', error);
        return throwError(() => error);
      })
    );
  }

  getUserActiveReservations(): Observable<any[]> {
    return this.http.get(`${this.RESERVATION_API_URL}/userReservations`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      map((response: any) => {
        if (response?.reservations && Array.isArray(response.reservations)) {
          return response.reservations;
        } else {
          console.warn('Unexpected API response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching active reservations:', error);
        return throwError(() => error); 
      })
    );
  }

  
}
