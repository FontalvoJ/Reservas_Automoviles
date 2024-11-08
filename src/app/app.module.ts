import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarHomeComponent } from './pages/Navbars/navbar-home/navbar-home.component';
import { NavbarAdminComponent } from './pages/Navbars/navbar-admin/navbar-admin.component';
import { NavbarClientComponent } from './pages/Navbars/navbar-client/navbar-client.component';
import { FooterGeneralComponent } from './pages/Footer/footer-general/footer-general.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarHomeComponent,
    NavbarAdminComponent,
    NavbarClientComponent,
    FooterGeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
