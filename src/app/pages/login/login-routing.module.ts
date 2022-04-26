import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,

  },
  {
    // el login es redirect
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class LoginRoutingModule { }
