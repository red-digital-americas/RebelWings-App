import { SalesExpectationComponent } from './task-morning/sales-expectation/sales-expectation.component';
import { LoungeMountedComponent } from './task-morning/lounge-mounted/lounge-mounted.component';
import { GasValidationComponent } from './task-morning/gas-validation/gas-validation.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CentroControlMatutinoComponent } from './task-morning/centro-control-matutino/centro-control-matutino.component';
import { CentroControlVespertinoComponent } from './task-evening/centro-control-vespertino/centro-control-vespertino.component';
import { AttendanceValidationComponent } from './task-morning/attendance-validation/attendance-validation.component';
import { WaitTablesComponent } from './task-morning/wait-tables/wait-tables.component';
const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
  },
  {
    path: 'control-matutino', // child route path
    component: CentroControlMatutinoComponent, // child route component that the router renders
  },
  {
    path: 'control-vespertino',
    component: CentroControlVespertinoComponent, // another child route component that the router renders
  },
  {
    path: 'validacion-assistencia',
    component: AttendanceValidationComponent,
  },
  {
    path: 'validacion-gas/:id',
    component: GasValidationComponent,
  },
  {
    path: 'salon-montado/:id',
    component: LoungeMountedComponent,
  },
  {
    path: 'expectativa-venta/:id',
    component: SalesExpectationComponent,
  },
  {
    path: 'mesa-espera/:id',
    component: WaitTablesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisoresRoutingModule {}
