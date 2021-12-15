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
}
