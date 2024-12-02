import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit {
  isModalOpenEditProfile = false;
  dropdownOpen = false;  
  clientData = {
    name: '',
    identification: '',
    address: '',
    contact: '',
    email: '',
    password: ''
  };
  showAlertUpdateInfo = false;
  isModalOpenDeleteAccount = false;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.getClientData();
  }

  // Toggle para abrir y cerrar el menú desplegable
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Método para obtener los datos del cliente
  getClientData() {
    this.clientService.getClientInfo().subscribe(
      (response) => {
        //console.log('Client data retrieved successfully', response);
        this.clientData = response.client;
      },
      (error) => {
        console.error('Error retrieving client data', error);
      }
    );
  }

  // Método para abrir el modal de edición de perfil
  openModalEdit() {
    this.isModalOpenEditProfile = true;
    this.toggleDropdown();  
  }

  // Método para cerrar el modal
  closeModalEdit() {
    this.isModalOpenEditProfile = false;
  }

  // Método para actualizar los datos del cliente
  updateClientInfo() {
    this.clientService.updateClientInfo(this.clientData).subscribe(
      (response) => {
        //console.log('Client data updated successfully', response);
        this.showAlertUpdateInfo = true;
        this.closeModalEdit();

        setTimeout(() => {
          this.showAlertUpdateInfo = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating client data', error);
      }
    );
  }

  
  openDeleteAccountModal() {
    this.isModalOpenDeleteAccount = true;
  }


  closeDeleteAccountModal() {
    this.isModalOpenDeleteAccount = false;
  }

  // Método para eliminar la cuenta del cliente
  deleteAccount() {
    this.clientService.deleteClientAccount().subscribe(
      (response) => {
       
        this.router.navigate(['/home']);
      },
      (error) => {
        
        console.error('Error deleting account:', error);
      }
    );
  }

}
