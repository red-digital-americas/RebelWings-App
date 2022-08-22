/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogNotificationComponent } from 'src/app/pages/nav/dialog-notification/dialog-notification.component';
import { LogoutComponent } from 'src/app/pages/popover/logout/logout.component';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-centro-control-vespertino',
  templateUrl: './centro-control-vespertino.component.html',
  styleUrls: ['./centro-control-vespertino.component.scss'],
})
export class CentroControlVespertinoComponent implements OnInit {
  public user: any;
  public vespertino = 2;
  public data: any[] = [];
  public dataNotification: any = [];
  // nombre de sucursal
  public branchId;
  // public nameBranch = '';
  public dataBranch: any[] = [];
  // se juntaron tablet y alarma
  public tabletAlarmaActive = false;
  public completeTablAndAlarm = false;
  public progressTablAndAlarm = 0;
  public colorTablAndAlarm;
  public today;
  public countAlarm = 0;
  public countVoladoEfectivo = 0;
  public valueVolado;
  public time;
  // variable menu seleccionable
  public task;

  public barProgressTask: number;
  public color: string;

  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public routerActive: ActivatedRoute,
    public datepipe: DatePipe

  ) { }

  ionViewWillEnter() {
    console.log('viewwillenter');
    this.ngOnInit();
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    this.branchId = this.user.branchId;
    this.task = this.routerActive.snapshot.paramMap.get(`idTarea`);
    // this.getBranch();
    this.getDataControl(this.task);
    // this.notificationAlarm();

  }
  ngOnInit() {
    this.today = new Date();
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    this.branchId = this.user.branchId;
    this.getDataControl(this.task);
    this.getNotification();
    this.notificationVoladoEfectivo();
    this.notificationAlarm();


  }
  getDataControl(task) {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branchId}/${this.vespertino}/${task}/Manager`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result.controlCenters;
          this.barProgressTask = resp.result.progress;
          if (this.barProgressTask === 0){
            this.color = 'danger';
          }
          else if (this.barProgressTask === 100){
            this.color = 'success';
          }
          else{
            this.color = 'warning';
          }
          console.log('control matutino', resp.result);
        }
      });
  }
  activeTabletAndAlarma() {
    this.tabletAlarmaActive = true;
    if (this.data[6].isComplete === false || this.data[7].isComplete === false) {
      this.completeTablAndAlarm = false;
      if (this.data[6].isComplete === false && this.data[7].isComplete === false) {
        this.progressTablAndAlarm = 0;
        this.colorTablAndAlarm = 'danger';
      }
      else if (this.data[6].isComplete === true || this.data[7].isComplete === true) {
        this.progressTablAndAlarm = .50;
        this.colorTablAndAlarm = 'warning';
      }
    }
    else {
      this.completeTablAndAlarm = true;
      this.colorTablAndAlarm = 'success';
      this.progressTablAndAlarm = 100;
    }
  }
  return() {
    console.log('return');
    this.router.navigateByUrl('supervisor');
    // window.history.back();
  }
  async notificationAlarm() {
    const timeAlarmaIni = '22:00:00';
    const timeAlarmaFin = '23:00:00';
    if (this.countAlarm === 0) {
      const time = `${this.today.getHours()}:${this.today.getMinutes()}:00`;
      // console.log('time', time);
      if (time >= timeAlarmaIni && time <= timeAlarmaFin) {
        this.countAlarm += 1;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alerta',
          message: 'Recuerda activar la Alarma y subir la evidencia correspondiente',
          mode: 'ios', //sirve para tomar el diseño de ios
          buttons: ['OK']
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
        console.log('count alarm', this.countAlarm);
      }
    }
  }
  async notificationVoladoEfectivo() {
    this.valueVolado = [];
    console.log('date', this.today);
    let timeTemp = '';
    const hour = this.today.getHours();
    const minute = this.today.getMinutes();
    let hourString = hour.toString();
    let minuteString = minute.toString();
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    if (hourString.length < 2) {
      hourString = `0${hourString}`;
    }
    if (minuteString.length < 2) {
      minuteString = `0${minuteString}`;
    }
    timeTemp = `${hourString}:${minuteString}:00`;
    this.time = `${date}T${timeTemp}`;
    console.log('format date', this.time);
    this.service.serviceGeneralGet(`CashRegisterShortage/GetCash?id_sucursal=${this.user.branch}&dataBase=${this.user.dataBase}`).subscribe(resp => {
      if (resp.success) {
        // si entra success el volado es mayor a 3000
        this.valueVolado = resp;
        this.valueVolado.message = Number(this.valueVolado.message);
        this.valueVolado.time = this.time;
        console.log('valor', this.valueVolado);
        localStorage.setItem('valueVolado', JSON.stringify(this.valueVolado));
        this.alertVolado();
      }
      else {

        // prueba
        // this.valueVolado = resp;
        // this.valueVolado.message = 3000;
        // this.valueVolado.time = this.time;
        // console.log('valor', this.valueVolado);
        // localStorage.setItem('valueVolado', JSON.stringify(this.valueVolado));
        // this.alertVolado();
        // //
        // this.valueVolado = resp;
        // this.valueVolado.time = this.time;
        console.log('Aun no hay 3mil pesos', this.valueVolado);

      }
    });
  }
  async alertVolado(){
    if (this.valueVolado.success === true) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Realiza el volado de efectivo',
        subHeader: `Por $ ${this.valueVolado.message} MXN`,
        message: 'Se activara un cronómetro para identificar en cuánto tiempo se hizo el volado de efectivo.',
        mode: 'ios', //sirve para tomar el diseño de ios
        buttons: ['OK']
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
  }
  //*****************notification*****************************
  async openNotification() {
  // package = 0 es nuevo registos, si es != 0 es update
  const modal = await this.modalController.create({
    component: DialogNotificationComponent,
    cssClass: 'my-custom-class',
    swipeToClose: true,
    componentProps: {
      id: this.user.branchId, //se envia el id de sucursal
    },
  });
  modal.onDidDismiss().then((data) => {
    console.log(data);
    this.ionViewWillEnter();
  });
  this.modalController.dismiss();
  return await modal.present();
}

  async logout(e: any) {
  const popover = await this.popoverCtrl.create({
    component: LogoutComponent,
    cssClass: 'my-custom-class',
    event: e,
    translucent: true,
    mode: 'ios', //sirve para tomar el diseño de ios
    backdropDismiss: true,
  });
  return await popover.present();

}


validacionAsistencia() {
  this.router.navigateByUrl('supervisor/validacion-assistencia/2');
}
terminarTurno() {
  this.router.navigateByUrl('supervisor');
}
remisiones(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/remisiones/2/' + id);
}
getNotification() {
  this.service
    .serviceGeneralGet('Transfer/Notifications?id=' + this.user.branchId)
    .subscribe((resp) => {
      if (resp.success) {
        this.dataNotification = resp.result;
        console.log('notificaciones', this.dataNotification);
      }
    });
}
productoRiesgo(id) {
  console.log('id producto en riesgo', id);
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/producto-riesgo/2/' + id);
}
albaranes(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/albaranes/' + id);
}
transferencias(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/transferencias/2/' + id);
}
voladoEfectivo(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/volado-efectivo/2/' + id);
}
resguardoPropina(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/resguardo-propina/' + id);
}
limpiezaSalonBanos(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/limpieza-salon-banos/' + id);
}
resguardoTableta(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/resguardo-tableta/' + id);
}
alarma(id) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/alarma/' + id);
}
tabletAndAlarma(idTablet, idAlarma) {
  if (idTablet === null) {
    idTablet = 0;
  }
  if (idAlarma === null) {
    idAlarma = 0;
  }
  console.log(`id tablet ${idTablet} id tablet ${idAlarma}`);
  this.router.navigateByUrl(`supervisor/resguardo-tableta/${idTablet}/alarma/${idAlarma}`);
}
mesas(id: number) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl(`supervisor/mesa-espera/2/${id}`);
}
stockPollo(id: number) {
  if (id === null) {
    id = 0;
  }
  this.router.navigateByUrl('supervisor/expectativa-venta/' + id);
}

}
