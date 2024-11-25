import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { HomeComponent } from './pages/home/home/home.component';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { DashboardClientComponent } from './pages/client/dashboard-client/dashboard-client.component';
import { SignUpUserComponent } from './pages/auth/sign-up-user/sign-up-user.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up-user', component: SignUpUserComponent},
  { path: 'dashboard-admin', component: DashboardAdminComponent},
  //{ path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [authGuard] },
  { path: 'dashboard-client', component: DashboardClientComponent, canActivate: [authGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }