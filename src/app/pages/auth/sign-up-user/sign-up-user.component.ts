import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css']
})
export class SignUpUserComponent {

  public formRegisterAdmin: FormGroup;
  public formRegisterClient: FormGroup;

  isAdminModalOpen: boolean = false;
  isClientModalOpen: boolean = false;
  showSuccessAdminAlert: boolean = false;
  showSuccessClientAlert: boolean = false;
  showErrorAdmin: boolean = false;
  showErrorClient: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.formRegisterAdmin = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });


    this.formRegisterClient = this.formBuilder.group({
      name: ['', Validators.required],
      identification: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],

    });
  }


  openAdminModal() {
    this.isAdminModalOpen = true;
  }

  closeAdminModal() {
    this.isAdminModalOpen = false;
    this.showErrorAdmin = false;
  }


  openClientModal() {
    this.isClientModalOpen = true;
  }

  closeClientModal() {
    this.isClientModalOpen = false;
    this.showErrorClient = false;
  }


  registerAdmin() {
    if (this.formRegisterAdmin.valid) {
      const adminData = this.formRegisterAdmin.value;
      this.authService.signUpAdmin(adminData).subscribe({
        next: () => {
          this.showSuccessAdminAlert = true;
          this.closeAdminModal();
          this.router.navigate(['/sign-up-user']);


          setTimeout(() => {
            this.showSuccessAdminAlert = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error during admin registration:', err);
        }
      });
    } else {
      console.warn('Admin form is invalid');
      this.showErrorAdmin = true;
    }
  }


  registerClient() {
    if (this.formRegisterClient.valid) {
      const clientData = this.formRegisterClient.value;
      this.authService.signUpClient(clientData).subscribe({
        next: () => {
          this.showSuccessClientAlert = true;
          this.closeClientModal();
          this.router.navigate(['/sign-up-user']);

          setTimeout(() => {
            this.showSuccessClientAlert = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error during client registration:', err);
        }
      });
    } else {
      console.warn('Client form is invalid');
      this.showErrorClient = true;
    }
  }
}
