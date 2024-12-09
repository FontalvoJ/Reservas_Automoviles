import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { HomeComponent } from './pages/home/home/home.component';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { DashboardClientComponent } from './pages/client/dashboard-client/dashboard-client.component';
import { SignUpUserComponent } from './pages/auth/sign-up-user/sign-up-user.component';
import { CarsComponent} from './pages/home/cars/cars.component';
import { EdiDeleCarsComponent } from './pages/admin/edi-dele-cars/edi-dele-cars.component';
import { authGuard } from './auth.guard';
import { UpdateInfoComponent } from './pages/client/update-info/update-info.component';
import { CarsReservationComponent } from './pages/client/cars-reservation/cars-reservation.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cars-home', component: CarsComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up-user', component: SignUpUserComponent},
   { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [authGuard] },
  { path: 'edi-eli-car', component: EdiDeleCarsComponent },
  { path: 'update-user', component: UpdateInfoComponent, canActivate: [authGuard] },
  { path: 'dashboard-client', component: DashboardClientComponent, canActivate: [authGuard] },
  { path: 'cars-to-reservation', component: CarsReservationComponent, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }