import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/admin/admin.service';
import { ReservationsService } from 'src/app/services/reservation/reservations.service';

@Component({
  selector: 'app-cars-reservation',
  templateUrl: './cars-reservation.component.html',
  styleUrls: ['./cars-reservation.component.css']
})
export class CarsReservationComponent implements OnInit {
  cars: any[] = [];
  errorMessage: string = '';
  selectedCar: any = null;
  showModal: boolean = false;
  startDate: string = '';
  endDate: string = '';
  totalDays: number = 0;
  priceTotal: number = 0;
  showAlert: boolean = false;

  constructor(private carService: CarService, private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCarsForAuthenticatedUser().subscribe(
      data => {
        if (data.cars && data.cars.length > 0) {
          this.cars = data.cars;
        } else {
          this.errorMessage = 'No hay coches disponibles.';
        }
      },
      error => {
        this.errorMessage = 'Error al cargar los coches. Por favor, intenta de nuevo más tarde.';
        console.error('Error al cargar los coches:', error);
      }
    );
  }

  generateReservation(car: any): void {
    this.selectedCar = car;
    this.showModal = true;
    this.startDate = '';
    this.endDate = '';
    this.totalDays = 0;
    this.priceTotal = 0;
  }

  calculateReservation(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.priceTotal = this.totalDays * this.selectedCar.pricePerDay;
    }
  }

  confirmReservation(): void {
    if (!this.startDate || !this.endDate) {
      console.error('You must select both start and end dates.');
      return;
    }

    this.reservationsService.createReservation(this.selectedCar._id, new Date(this.startDate), new Date(this.endDate))
      .subscribe(
        response => {
    
          this.showAlert = true; 
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
          this.showModal = false; 
        },
        error => {
          console.error('Error creating the reservation:', error);
          alert('An error occurred while creating the reservation. Please try again.');
        }
      );
  }

  closeModal(): void {
    this.showModal = false;
  }
}