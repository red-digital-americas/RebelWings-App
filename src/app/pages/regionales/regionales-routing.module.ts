
// angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// paginas
// pagina que permite elegir al regional la sucursal con la que trabajara
import { ScheduleRegionalComponent } from './schedule-regional/schedule-regional.component';
import { CentroControlComponent } from './centro-control/centro-control.component';
const routes: Routes = [
  {
    path: '',
    component: ScheduleRegionalComponent,
  },
  {
    path: 'centro-control', // child route path
    component: CentroControlComponent, // child route component that the router renders
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionalesRoutingModule {}
