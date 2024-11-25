import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-list-cars-reservations',
  templateUrl: './list-cars-reservations.component.html',
  styleUrls: ['./list-cars-reservations.component.css']
})
export class ListCarsReservationsComponent implements OnInit {
  isModalOpen: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  formRegisterVehicle: FormGroup;

  constructor(private fb: FormBuilder, private carService: CarService) {
    
    this.formRegisterVehicle = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      color: ['', Validators.required],
      availability: [true],
      pricePerDay: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }


  openModal() {
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
  }


  onSubmit() {
    if (this.formRegisterVehicle.valid) {
      this.isSubmitting = true;


      this.carService.createCar(this.formRegisterVehicle.value).subscribe(
        response => {
          console.log('Car created successfully!', response);
          this.isSubmitting = false;
          this.closeModal();
        },
        error => {
          console.error('Error creating car:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Failed to create car. Please try again later.';
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
