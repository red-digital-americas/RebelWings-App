import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-centro-control-matutino',
  templateUrl: './centro-control-matutino.component.html',
  styleUrls: ['./centro-control-matutino.component.scss'],
})
export class CentroControlMatutinoComponent implements OnInit {
  public matutino = 1;
  public user;
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
      .serviceGeneralGet(`ControlCenter/${this.user.branch}/${this.matutino}`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('control', resp.result);
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
    this.router.navigateByUrl('horario/validacion-assistencia/1');
  }
  validacionGas(id: number) {
    if(id === null){
      id = 0;
    }
    this.router.navigateByUrl('horario/validacion-gas/' + id);
  }
  salonMontado(id: number) {
    this.router.navigateByUrl('horario/salon-montado/' + id);
  }
  stockPollo(id: number) {
    this.router.navigateByUrl('horario/expectativa-venta/' + id);
  }
  terminarTurno() {
    this.router.navigateByUrl('horario');
  }
  mesas(id: number) {
    this.router.navigateByUrl('horario/mesa-espera/' + id);
  }
}
