// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
// routing
import { RegionalesRoutingModule } from './regionales-routing.module';
// pages
import { CentroControlComponent } from './centro-control/centro-control.component';

@NgModule({
  declarations: [
    CentroControlComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    IonicSelectableModule,
    RegionalesRoutingModule,
  ],
  providers: [DatePicker],
})
export class RegionalesModule {}
