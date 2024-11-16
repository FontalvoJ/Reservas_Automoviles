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
  isAdminModalOpen: boolean = false;
  showSuccessAdminAlert: boolean = false;

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
  }

  openAdminModal() {
    this.isAdminModalOpen = true;
  }

  closeAdminModal() {
    this.isAdminModalOpen = false;
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
      console.warn('Form is invalid');
    }
  }
  
}
