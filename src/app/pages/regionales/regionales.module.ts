// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
// package
import { IonicRatingModule } from 'ionic-rating';
// routing
import { RegionalesRoutingModule } from './regionales-routing.module';
// pages
import { ScheduleRegionalComponent } from './schedule-regional/schedule-regional.component';
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
import { EstadoGeneralBanosComponent } from './estado-general-banos/estado-general-banos.component';
import { LavabosJabonPapelBanosComponent } from './lavabos-jabon-papel-banos/lavabos-jabon-papel-banos.component';
import { TicketMesaSistemaCajaComponent } from './ticket-mesa-sistema-caja/ticket-mesa-sistema-caja.component';
import { EntradasCargadasSistemaCajaComponent } from './entradas-cargadas-sistema-caja/entradas-cargadas-sistema-caja.component';
import { RevisionPedidoSistemaCajaComponent } from './revision-pedido-sistema-caja/revision-pedido-sistema-caja.component';
import { RevisionMesasSistemaCajaComponent } from './revision-mesas-sistema-caja/revision-mesas-sistema-caja.component';
import { CocinaMantenimientoComponent } from './cocina-mantenimiento/cocina-mantenimiento.component';
import { SalonMantenimientoComponent } from './salon-mantenimiento/salon-mantenimiento.component';
import { BanosMantenimientoComponent } from './banos-mantenimiento/banos-mantenimiento.component';
import { BarraMantenimientoComponent } from './barra-mantenimiento/barra-mantenimiento.component';
import { LevantamientoTicketComponent } from './levantamiento-ticket/levantamiento-ticket.component';


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
    RefrigeradoresSalonComponent,
    ScheduleRegionalComponent,
    EstadoGeneralBanosComponent,
    LavabosJabonPapelBanosComponent,
    TicketMesaSistemaCajaComponent,
    EntradasCargadasSistemaCajaComponent,
    RevisionPedidoSistemaCajaComponent,
    RevisionMesasSistemaCajaComponent,
    CocinaMantenimientoComponent,
    SalonMantenimientoComponent,
    BanosMantenimientoComponent,
    BarraMantenimientoComponent,
    LevantamientoTicketComponent
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
