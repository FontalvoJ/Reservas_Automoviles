import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up-users',
  templateUrl: './sign-up-users.component.html',
  styleUrls: ['./sign-up-users.component.css']
})
export class SignUpUsersComponent {
  isRegisterModalOpen = false;
  formRegister: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      identification: [''],
      address: [''],
      contact: ['']
    });

    // Actualiza validadores cuando cambia el rol
    this.formRegister.get('role')?.valueChanges.subscribe((role: string) => {
      const clientFields = ['identification', 'address', 'contact'];
      if (role === 'client') {
        clientFields.forEach(field =>
          this.formRegister.get(field)?.setValidators(Validators.required)
        );
      } else {
        clientFields.forEach(field =>
          this.formRegister.get(field)?.clearValidators()
        );
      }
      clientFields.forEach(field =>
        this.formRegister.get(field)?.updateValueAndValidity()
      );
    });
  }

  onSubmit(): void {
    if (this.formRegister.valid) {
      console.log('Formulario válido:', this.formRegister.value);
      // Aquí podrías llamar a un servicio para enviar los datos
      this.isRegisterModalOpen = false;
    } else {
      console.log('Formulario inválido');
      this.formRegister.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.isRegisterModalOpen = false;
  }
}
