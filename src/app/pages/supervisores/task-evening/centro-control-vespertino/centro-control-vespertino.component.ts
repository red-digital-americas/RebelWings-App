import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-centro-control-vespertino',
  templateUrl: './centro-control-vespertino.component.html',
  styleUrls: ['./centro-control-vespertino.component.scss'],
})
export class CentroControlVespertinoComponent implements OnInit {
  public user: any;
  public vespertino = 2;
  public data: any = [];

  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.getDataControl();
  }
  ngOnInit() {}
  getDataControl() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branch}/${this.vespertino}`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('control vespertino', resp.result);
          this.data = resp.result;
        }
      });
  }
  return() {
    console.log('return');
    this.router.navigateByUrl('horario');
    // window.history.back();
  }
  validacionAsistencia() {
    this.router.navigateByUrl('horario/validacion-assistencia/2');
  }
  terminarTurno() {
    this.router.navigateByUrl('horario');
  }
  remisiones(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/remisiones/' + id);
  }
  productoRiesgo(id) {
    console.log('id producto en riesgo', id);
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/producto-riesgo/' + id);
  }
  albaranes(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/albaranes/' + id);
  }
  transferencias(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/transferencias/' + id);
  }
  voladoEfectivo(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/volado-efectivo/' + id);
  }
  resguardoPropina(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/resguardo-propina/' + id);
  }
  limpiezaSalonBanos(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/limpieza-salon-banos/' + id);
  }
  resguardoTableta(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/resguardo-tableta/' + id);
  }
  alarma(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/alarma/' + id);
  }
  mesas(id: number) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/mesa-espera/' + id);
  }
  stockPollo(id: number) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('horario/expectativa-venta/' + id);
  }
}
