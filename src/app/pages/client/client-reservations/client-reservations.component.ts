import { Component, OnInit } from '@angular/core';
import { ReservationsService } from 'src/app/services/reservation/reservations.service';

@Component({
  selector: 'app-client-reservations',
  templateUrl: './client-reservations.component.html',
  styleUrls: ['./client-reservations.component.css']
})
export class ClientReservationsComponent implements OnInit {
  Math = Math;
  activeReservations: any[] = [];
  errorMessage: string | null = null;
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de items por página

  constructor(private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    this.getActiveReservations();
  }

  getActiveReservations(): void {
    this.reservationsService.getUserActiveReservations().subscribe({
      next: (reservations) => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.activeReservations = reservations.slice(start, end).map(reservation => ({
          ...reservation,
          totalDays: this.calculateTotalDays(reservation.startDate, reservation.endDate),
        }));
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching active reservations:', error);
        this.errorMessage = 'Failed to load reservations. Please try again later.';
      }
    });
  }

  private calculateTotalDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.getActiveReservations();
  }

  totalPages(): number {
    return Math.ceil(this.activeReservations.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
