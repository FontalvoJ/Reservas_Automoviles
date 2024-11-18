import { Component, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar-client',
  templateUrl: './navbar-client.component.html',
  styleUrls: ['./navbar-client.component.css']
})
export class NavbarClientComponent {

  userName: string | null = null;
  isMenuOpen = false;

  constructor(private renderer: Renderer2, private authService: AuthService) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;


    if (this.isMenuOpen) {
      this.renderer.addClass(document.body, 'menu-open');
    } else {
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

}