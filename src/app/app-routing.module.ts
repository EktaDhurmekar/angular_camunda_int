import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateProcessComponent } from './create-process/create-process.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { AuthGuard } from './gaurds/auth.gaurd'

const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegistrationComponent },
  { path: 'create-process', component: CreateProcessComponent, canActivate: [AuthGuard]},
  { path: 'tasklist', component: TasklistComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/create-process', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
