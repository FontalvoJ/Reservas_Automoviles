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
  showAlertReservationActive: boolean = false;
  alertMessage: string = '';

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
          this.errorMessage = 'No cars available.';
        }
      },
      error => {
        this.errorMessage = 'Error loading cars. Please try again later.';
        console.error('Error loading cars:', error);
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
          this.alertMessage = 'Reservation created successfully!';
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
          this.showModal = false; 
        },
        error => {
          console.error('Error creating the reservation:', error);
          if (error.status === 400 && error.error.message) {
            this.alertMessage = error.error.message;
            this.showAlertReservationActive = true; 
            this.alertMessage = 'An error occurred while creating the reservation. Please try again.';
          }
          this.showAlert = true; 
          setTimeout(() => {
            this.showAlert = false;
            this.showAlertReservationActive = false;
          }, 3000); 
          this.showModal = false; 
        }
      );
  }

  closeModal(): void {
    this.showModal = false;
  }
}
