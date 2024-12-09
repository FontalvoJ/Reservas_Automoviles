import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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
    });
  }

}
