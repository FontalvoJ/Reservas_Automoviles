import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarHomeComponent } from './pages/Navbars/navbar-home/navbar-home.component';
import { NavbarAdminComponent } from './pages/Navbars/navbar-admin/navbar-admin.component';
import { NavbarClientComponent } from './pages/Navbars/navbar-client/navbar-client.component';
import { FooterGeneralComponent } from './pages/Footer/footer-general/footer-general.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { HomeComponent } from './pages/home/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarHomeComponent,
    NavbarAdminComponent,
    NavbarClientComponent,
    FooterGeneralComponent,
    SignInComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
