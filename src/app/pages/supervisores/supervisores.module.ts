import { DialogAddTransferComponent } from './dialog/dialog-add-transfer/dialog-add-transfer.component';
import { TransferenciasComponent } from './task-evening/transferencias/transferencias.component';
import { LimpiezaSalonBanosComponent } from './task-evening/limpieza-salon-banos/limpieza-salon-banos.component';
import { ResguardoTabletaComponent } from './task-evening/resguardo-tableta/resguardo-tableta.component';
import { AlarmaComponent } from './task-evening/alarma/alarma.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SupervisoresRoutingModule } from './supervisores-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { CentroControlVespertinoComponent } from './task-evening/centro-control-vespertino/centro-control-vespertino.component';
import { CentroControlMatutinoComponent } from './task-morning/centro-control-matutino/centro-control-matutino.component';
import { AttendanceValidationComponent } from './task-morning/attendance-validation/attendance-validation.component';
import { GasValidationComponent } from './task-morning/gas-validation/gas-validation.component';
import { LoungeMountedComponent } from './task-morning/lounge-mounted/lounge-mounted.component';
import { SalesExpectationComponent } from './task-morning/sales-expectation/sales-expectation.component';
import { DialoAddCommentAttendanceComponent } from './dialog/dialo-add-comment-attendance/dialo-add-comment-attendance.component';
import { DialogAddPackageComponent } from './dialog/dialog-add-package/dialog-add-package.component';
import { DialogAddRegisterUsePackageComponent } from './dialog/dialog-add-register-use-package/dialog-add-register-use-package.component';
import { WaitTablesComponent } from './task-morning/wait-tables/wait-tables.component';
import { ResguardoPropinaComponent } from './task-evening/resguardo-propina/resguardo-propina.component';
import { VoladoEfectivoComponent } from './task-evening/volado-efectivo/volado-efectivo.component';
import { ProductoRiesgoComponent } from './task-evening/producto-riesgo/producto-riesgo.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableModule } from 'ionic-selectable';



@NgModule({
  declarations: [
    ScheduleComponent,
    CentroControlMatutinoComponent,
    CentroControlVespertinoComponent,
    AttendanceValidationComponent,
    GasValidationComponent,
    LoungeMountedComponent,
    SalesExpectationComponent,
    DialoAddCommentAttendanceComponent,
    DialogAddPackageComponent,
    DialogAddRegisterUsePackageComponent,
    WaitTablesComponent,
    AlarmaComponent,
    ResguardoTabletaComponent,
    ResguardoPropinaComponent,
    VoladoEfectivoComponent,
    LimpiezaSalonBanosComponent,
    ProductoRiesgoComponent,
    TransferenciasComponent,
    DialogAddTransferComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SupervisoresRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    IonicSelectableModule,
  ],
  providers: [DatePicker],
})
export class SupervisoresModule {}
