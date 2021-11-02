import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { WelcomeComponent } from './pages/login/welcome/welcome.component';
// rutas a verificar

import { ScheduleComponent } from './pages/supervisores/schedule/schedule.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'horario',
    loadChildren: () =>
      import('./pages/supervisores/supervisores.module').then(
        (m) => m.SupervisoresModule
      ),
  },
  {
    path: 'horario-regional',
    loadChildren: () =>
      import('./pages/regionales/regionales.module').then((m) => m.RegionalesModule
      ),
  },
  // verificar
  { path: 'recuperar-contrasena', component: ForgotPasswordComponent },
  { path: 'bienvenido', component: WelcomeComponent },
  {
    // el login es redirect
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })

    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
