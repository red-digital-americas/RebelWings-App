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
import { OrderCocinaComponent } from './order-cocina/order-cocina.component';
import { RefrigeradoresCocinaComponent } from './refrigeradores-cocina/refrigeradores-cocina.component';
import { PolloPrecoccionCocinaComponent } from './pollo-precoccion-cocina/pollo-precoccion-cocina.component';
import { ProductosCompletosCocinaComponent } from './productos-completos-cocina/productos-completos-cocina.component';
import { LimpiezaFreidorasCocinaComponent } from './limpieza-freidoras-cocina/limpieza-freidoras-cocina.component';
import { ConteoPersonasSalonComponent } from './conteo-personas-salon/conteo-personas-salon.component';
import { EncuestaSalonComponent } from './encuesta-salon/encuesta-salon.component';
import { LimpiezaGeneralSalonComponent } from './limpieza-general-salon/limpieza-general-salon.component';
import { EstacionSalonComponent } from './estacion-salon/estacion-salon.component';
import { TemperaturasBebidasSalonComponent } from './temperaturas-bebidas-salon/temperaturas-bebidas-salon.component';
import { AudioVideoSalonComponent } from './audio-video-salon/audio-video-salon.component';
import { FocosSalonComponent } from './focos-salon/focos-salon.component';
import { LimpiezaBarraSalonComponent } from './limpieza-barra-salon/limpieza-barra-salon.component';
import { RefrigeradoresSalonComponent } from './refrigeradores-salon/refrigeradores-salon.component';
// package
import { IonicRatingModule } from 'ionic-rating';


@NgModule({
  declarations: [
    CentroControlComponent,
    OrderCocinaComponent,
    RefrigeradoresCocinaComponent,
    PolloPrecoccionCocinaComponent,
    ProductosCompletosCocinaComponent,
    LimpiezaFreidorasCocinaComponent,
    ConteoPersonasSalonComponent,
    EncuestaSalonComponent,
    LimpiezaGeneralSalonComponent,
    EstacionSalonComponent,
    TemperaturasBebidasSalonComponent,
    AudioVideoSalonComponent,
    FocosSalonComponent,
    LimpiezaBarraSalonComponent,
    RefrigeradoresSalonComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    IonicSelectableModule,
    RegionalesRoutingModule,
    IonicRatingModule,
  ],
  providers: [DatePicker],
})
export class RegionalesModule {}
