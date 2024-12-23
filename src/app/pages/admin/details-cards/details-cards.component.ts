import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-details-cards',
  templateUrl: './details-cards.component.html',
  styleUrls: ['./details-cards.component.css']
})
export class DetailsCardsComponent implements OnInit {
  cars: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCar: any = null;
  isModalOpenDeleteCar = false;
  showSuccessCarDelete: boolean = false;

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.fetchCars();

  }


  fetchCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carService.getAllCarsByAdmin().subscribe(
      (response: any) => {
        this.cars = response?.cars || [];
        this.isLoading = false;
      },
      (error) => {

        // console.error('Error fetching cars:', error);

        this.errorMessage = 'Failed to load cars. Please try again later.';
        this.isLoading = false;
      }
    );
  }


  openModalDeleteCar(car: any): void {
    this.selectedCar = car;
    this.isModalOpenDeleteCar = true;
    //console.log('Attempting to delete car with _id:', this.selectedCar.carId); // Log para verificar el _id
  }

  // Cierra el modal sin eliminar el auto
  cancelDelete(): void {
    this.isModalOpenDeleteCar = false;
  }

  // Método para confirmar la eliminación del auto
  confirmDelete(): void {
    if (this.selectedCar && this.selectedCar.carId) {
      //console.log('Attempting to delete car with carId:', this.selectedCar.carId); 

      this.carService.deleteCar(this.selectedCar.carId).subscribe(
        (response) => {
          //console.log('Car deleted successfully!', response);

          this.cars = this.cars.filter(car => car.carId !== this.selectedCar.carId);
          this.isModalOpenDeleteCar = false;
          this.showSuccessCarDelete = true;


          setTimeout(() => {
            this.showSuccessCarDelete = false;
          }, 3000);
        },
        (error) => {

          console.error('Error deleting car:', error);
          if (error.error && error.error.message) {
            console.log('Error Message:', error.error.message);
          }

          this.errorMessage = 'Failed to delete the car. Please try again later.';
          this.isModalOpenDeleteCar = false;
        }
      );
    } else {
      console.error('Car carId is missing!');
    }
  }
}
