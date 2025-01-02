import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/admin/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-details-cards',
  templateUrl: './details-cards.component.html',
  styleUrls: ['./details-cards.component.css']
})
export class DetailsCardsComponent implements OnInit {
  cars: any[] = [];
  originalCar: any; 

  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCar: any = null;
  isModalOpenDeleteCar = false;
  showSuccessCarDelete: boolean = false;
  isModalOpenUpdateCar = false; 
  updateOption: string | null = null; 
  showAlertUpdateAvailability: boolean = false; 

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
  // Abre el modal de actualización para el coche seleccionado
  openModalUpdateCar(car: any): void {
    this.selectedCar = { ...car };  // Crear una copia del coche seleccionado
    this.originalCar = { ...car };  // Guardar la copia original
    this.isModalOpenUpdateCar = true;  // Abrir el modal
    this.updateOption = null;  // Resetea la opción de actualización, en caso de que se haya quedado alguna opción seleccionada
  }


  // Cierra el modal sin hacer cambios
  cancelUpdate(): void {
    this.isModalOpenUpdateCar = false;
    this.updateOption = '';
  }

  
  updateAvailability(): void {
    if (this.selectedCar && this.updateOption === 'availability') {
      // Verificamos si realmente hubo un cambio en la disponibilidad
      if (this.selectedCar.availability !== this.originalCar.availability) {
        console.log('Updating availability for car with ID:', this.selectedCar._id);
        console.log('New availability status:', this.selectedCar.availability);

        const updatedCarData = { availability: this.selectedCar.availability };

        // Hacemos la actualización en el servicio
        this.carService.updateCar(this.selectedCar._id, updatedCarData).subscribe(
          (response) => {
            console.log('Availability updated successfully!', response);

            // Actualizar la lista de coches localmente (si es necesario)
            const updatedCarIndex = this.cars.findIndex(car => car._id === this.selectedCar._id);
            if (updatedCarIndex !== -1) {
              this.cars[updatedCarIndex].availability = this.selectedCar.availability;
            }

            // Mostrar la alerta de éxito
            this.showAlertUpdateAvailability = true;

            // Cerrar el modal después de la actualización
            this.isModalOpenUpdateCar = false;

            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
              this.showAlertUpdateAvailability = false;
            }, 3000);
          },
          (error) => {
            console.error('Error updating car availability:', error);
            this.errorMessage = 'Failed to update car availability. Please try again later.';
          }
        );
      } else {
        console.log('No changes in availability. Update skipped.');
      }
    } else {
      console.error('Selected car or availability is missing');
    }
  }




  // Se ejecuta cuando el usuario elige actualizar otra información del coche
  updateCarInfo(): void {
    if (this.selectedCar && this.updateOption === 'info') {
      // Aquí puedes preparar los datos que el usuario haya modificado, por ejemplo:
      const updatedCarData = {
        model: this.selectedCar.model, // Aquí agregarías los campos modificados
        brand: this.selectedCar.brand,
        color: this.selectedCar.color,
        pricePerDay: this.selectedCar.pricePerDay
        // Agrega aquí más campos si es necesario
      };

      this.carService.updateCar(this.selectedCar._id, updatedCarData).subscribe(
        (response) => {
          this.isModalOpenUpdateCar = false;
        },
        (error) => {
          this.errorMessage = 'Failed to update car info. Please try again later.';
        }
      );
    }
  }

}
