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

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    this.fetchCars();
  }

  /**
   * Obtiene la lista de autos registrados por el administrador.
   */
  fetchCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.carService.getAllCarsByAdmin().subscribe(
      (response: any) => {
        console.log('Cars fetched:', response); 
        this.cars = response?.cars || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching cars:', error);
        this.errorMessage = 'Failed to load cars. Please try again later.';
        this.isLoading = false;
      }
    );
  }
}
