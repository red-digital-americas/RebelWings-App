import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogNotificationComponent } from 'src/app/pages/nav/dialog-notification/dialog-notification.component';

@Component({
  selector: 'app-centro-control',
  templateUrl: './centro-control.component.html',
  styleUrls: ['./centro-control.component.scss'],
})
export class CentroControlComponent implements OnInit {
  public user: any;
  public vespertino = 2;
  public data: any[] = [];
  public dataNotification: any = [];
  // variable menu seleccionable
  public task = 'cocina';

  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public modalController: ModalController
  ) {}
  // segment
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.getDataControl();
    this.getNotification();
  }
  ngOnInit() {}
  // obtiene el estatus de cada tarea
  getDataControl() {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branch}/1/Regional`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result.controlCenters;
          console.log('control vespertino', this.data);
        }
      });
  }
  return() {
    console.log('return');
    this.router.navigateByUrl('regional');
    // window.history.back();
  }
  terminarTurno() {
    this.router.navigateByUrl('regional');
  }
  //*****************notification*****************************
  async openNotification() {
    // package = 0 es nuevo registos, si es != 0 es update
    const modal = await this.modalController.create({
      component: DialogNotificationComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        id: this.user.branch, //se envia el id de sucursal
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.ionViewWillEnter();
    });
    this.modalController.dismiss();
    return await modal.present();
  }
  // notificaciones de regional
  getNotification() {
    this.service
      .serviceGeneralGet('Transfer/Notifications?id=' + this.user.branch)
      .subscribe((resp) => {
        if (resp.success) {
          this.dataNotification = resp.result;
          console.log('notificaciones', this.dataNotification);
        }
      });
  }
  //----------------------tareas de cocina---------------------
  ordenCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/ordenes/' + this.user.branch);
  }
  refrigeradorCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/refrigeradores-cocina/' + this.user.branch);
  }
  polloPrecoccionCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/pollo-precoccion/' + this.user.branch);
  }
  productosCompletosCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/productos-completos-orden/' + this.user.branch);
  }
  limpiezaFreidorasCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-freidoras/' + this.user.branch);
  }
  //----------------------tareas de salon---------------------
  conteoPersonasSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/conteo-personas/' + this.user.branch);
  }
  encuestaSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/encuesta/' + this.user.branch);
  }
  limpiezaGeneralSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-general/' + this.user.branch);
  }
  estacionSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/estacion/' + this.user.branch);
  }
  temperaturaBebidaSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/temperatura-bebidas/' + this.user.branch);
  }
  audioVideoSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/audio-video/' + this.user.branch);
  }
  focosSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/focos/' + this.user.branch);
  }
  limpiezaBarraSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-barra/' + this.user.branch);
  }
  refrigeradoresSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/refrigeradores-salon/' + this.user.branch);
  }

}
