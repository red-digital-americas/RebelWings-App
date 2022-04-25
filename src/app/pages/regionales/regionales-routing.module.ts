
// angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// paginas
// pagina que permite elegir al regional la sucursal con la que trabajara
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
const routes: Routes = [
  {
    path: '',
    // component: CentroControlComponent,
    component: ScheduleRegionalComponent,
  },
  {
    path: 'centro-control/:id/tarea/:idTarea', // child route path
    component: CentroControlComponent, // child route component that the router renders
  },
  {
    path: 'ordenes/:id',
    component: OrderCocinaComponent,
  },
  {
    path: 'refrigeradores-cocina/:id',
    component: RefrigeradoresCocinaComponent,
  },
  {
    path: 'pollo-precoccion/:id',
    component: PolloPrecoccionCocinaComponent,
  },
  {
    path: 'productos-completos-orden/:id',
    component: ProductosCompletosCocinaComponent,
  },
  {
    path: 'limpieza-freidoras/:id',
    component: LimpiezaFreidorasCocinaComponent,
  },
  {
    path: 'conteo-personas/:id',
    component: ConteoPersonasSalonComponent,
  },
  {
    path: 'encuesta/:id',
    component: EncuestaSalonComponent,
  },
  {
    path: 'limpieza-general/:id',
    component: LimpiezaGeneralSalonComponent,
  },
  {
    path: 'estacion/:id',
    component: EstacionSalonComponent,
  },
  {
    path: 'temperatura-bebidas/:id',
    component: TemperaturasBebidasSalonComponent,
  },
  {
    path: 'audio-video/:id',
    component: AudioVideoSalonComponent,
  },
  {
    path: 'focos/:id',
    component: FocosSalonComponent,
  },
  {
    path: 'limpieza-barra/:id',
    component: LimpiezaBarraSalonComponent,
  },
  {
    path: 'refrigeradores-salon/:id',
    component: RefrigeradoresSalonComponent,
  },
  {
    path: 'estado-general/:id',
    component: EstadoGeneralBanosComponent,
  },
  {
    path: 'lavabos-jabon-papel/:id',
    component: LavabosJabonPapelBanosComponent,
  },
  {
    path: 'ticket-mesa/:id',
    component: TicketMesaSistemaCajaComponent,
  },
  {
    path: 'entradas-cargadas/:id',
    component: EntradasCargadasSistemaCajaComponent,
  },
  {
    path: 'revision-pedido/:id',
    component: RevisionPedidoSistemaCajaComponent,
  },
  {
    path: 'revision-mesas/:id',
    component: RevisionMesasSistemaCajaComponent,
  },
  {
    path: 'cocina-mantenimiento/:id',
    component: CocinaMantenimientoComponent,
  },
  {
    path: 'salon-mantenimiento/:id',
    component: SalonMantenimientoComponent,
  },
  {
    path: 'baño-mantenimiento/:id',
    component: BanosMantenimientoComponent,
  },
  {
    path: 'barra-mantenimiento/:id',
    component: BarraMantenimientoComponent,
  },
  {
    path: 'levantamiento-ticket/:id',
    component: LevantamientoTicketComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionalesRoutingModule { }
