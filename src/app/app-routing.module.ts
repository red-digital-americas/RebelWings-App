import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { WelcomeComponent } from './pages/login/welcome/welcome.component';
import { HistoryTicketComponent } from './pages/shared/history-ticket/history-ticket.component';
import { OpenTicketComponent } from './pages/shared/open-ticket/open-ticket.component';


// aqui se carga por modulos

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'supervisor',
    loadChildren: () =>
      import('./pages/supervisores/supervisores.module').then(
        (m) => m.SupervisoresModule
      ),
  },
  {
    path: 'regional',
    loadChildren: () =>
      import('./pages/regionales/regionales.module').then((m) => m.RegionalesModule
      ),
  },
  // verificar
  { path: 'recuperar-contrasena', component: ForgotPasswordComponent },
  { path: 'bienvenido', component: WelcomeComponent },
  { path: 'historial-ticket/:id', component: HistoryTicketComponent },
  { path: 'editar-ticket/:branch/:id', component: OpenTicketComponent },

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
