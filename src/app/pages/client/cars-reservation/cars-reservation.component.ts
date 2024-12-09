import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/admin/admin.service';
import { ReservationsService } from 'src/app/services/reservation/reservations.service';

@Component({
  selector: 'app-cars-reservation',
  templateUrl: './cars-reservation.component.html',
  styleUrls: ['./cars-reservation.component.css']
})
export class CarsReservationComponent implements OnInit {
  authenticatedCars: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isModalReserve: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalDays: number = 0;
  totalCost: number = 0;
  selectedCarId: string | null = null;

  constructor(private carService: CarService, private reservationsService: ReservationsService) { }

  ngOnInit(): void {
    this.fetchAuthenticatedCars();
  }

  /**
   * Obtiene los coches disponibles para el usuario autenticado.
   */
  fetchAuthenticatedCars(): void {
    this.isLoading = true; // Muestra el indicador de carga
    this.errorMessage = null; // Resetea mensajes de error previos

    this.carService.getCarsForAuthenticatedUser().subscribe({
      next: (response) => {
        this.authenticatedCars = response.cars;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching authenticated cars:', err);
        this.errorMessage = 'Failed to load cars. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Abre el modal de reserva y guarda el ID del coche seleccionado.
   * @param carId ID del coche seleccionado
   */
  openModal(carId: string): void {
    this.selectedCarId = carId; // Almacena el ID del coche seleccionado
    console.log('Selected Car ID:', this.selectedCarId); // Verificar en la consola
    this.isModalReserve = true;
  }

  /**
   * Cierra el modal de reserva.
   */
  closeModal(): void {
    this.isModalReserve = false;
  }

  /**
   * Calcula los días y el costo total basado en las fechas seleccionadas.
   */
  calculateTotal(): void {
    if (this.startDate && this.endDate) {
      const timeDiff = Math.abs(this.endDate.getTime() - this.startDate.getTime());
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Días de diferencia
      const car = this.authenticatedCars.find(car => car.id === this.selectedCarId);
      if (car) {
        this.totalCost = this.totalDays * car.pricePerDay;
      }
    }
  }

  /**
   * Crea una nueva reserva para el coche seleccionado.
   */
  reserveCar(): void {
    if (!this.selectedCarId || !this.startDate || !this.endDate) {
      console.error('Incomplete reservation data');
      this.errorMessage = 'Please provide complete reservation details.';
      return;
    }

    // Convertir a objetos Date si aún no lo son
    const startDate = typeof this.startDate === 'string' ? new Date(this.startDate) : this.startDate;
    const endDate = typeof this.endDate === 'string' ? new Date(this.endDate) : this.endDate;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date format');
      this.errorMessage = 'Please enter valid start and end dates.';
      return;
    }

    this.reservationsService.createReservation(this.selectedCarId, startDate, endDate)
      .subscribe(
        response => {
          console.log('Reservation successful:', response);
          this.isModalReserve = false; // Cierra el modal
          this.fetchAuthenticatedCars(); // Recarga los coches para reflejar la nueva reserva
        },
        error => {
          console.error('Error creating reservation:', error);
          this.errorMessage = 'Failed to create reservation. Please try again later.';
        }
      );
  }

}
