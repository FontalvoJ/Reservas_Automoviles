import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit {
  isModalOpen = false;
  clientData = {
    name: '',
    identification: '',
    address: '',
    contact: '',
    email: '',
    password: ''
  };
  showAlertUpdateInfo = false;  

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClientData(); 
  }

 
  getClientData() {
    this.clientService.getClientInfo().subscribe(
      (response) => {
        console.log('Client data retrieved successfully', response);
        this.clientData = response.client;
      },
      (error) => {
        console.error('Error retrieving client data', error);
      }
    );
  }

 
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

 
  updateClientInfo() {
    this.clientService.updateClientInfo(this.clientData).subscribe(
      (response) => {
        console.log('Client data updated successfully', response);
        this.showAlertUpdateInfo = true; 
        this.closeModal(); 

      
        setTimeout(() => {
          this.showAlertUpdateInfo = false;
        }, 3000);
      },
      (error) => {
        console.error('Error updating client data', error);
      }
    );
  }
}
