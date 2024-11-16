import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css']
})
export class SignUpUserComponent {
 
  isAdminModalOpen: boolean = false;

  openAdminModal() {
    this.isAdminModalOpen = true;
  }
  
  closeAdminModal() {
    this.isAdminModalOpen = false;
  }
}
