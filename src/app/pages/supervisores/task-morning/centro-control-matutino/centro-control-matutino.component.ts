import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { LogoutComponent } from 'src/app/pages/popover/logout/logout.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-centro-control-matutino',
  templateUrl: './centro-control-matutino.component.html',
  styleUrls: ['./centro-control-matutino.component.scss'],
})
export class CentroControlMatutinoComponent implements OnInit {
  public matutino = 1;
  public user;
  public data: any = [];
  // nombre de sucursal
  public today = new Date();
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];
  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController,
    // public alertController: AlertController,

  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    this.branchId = this.user.branchId;
    this.getBranch();
    this.getDataControl();
    // this.notificationAlarm();
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.getDataControl();
  }
  getDataControl() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branchId}/${this.matutino}/Manager`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('control', resp.result);
          this.data = resp.result;
        }
      });
  }

  // async notificationAlarm(){
  //   const timeAlarmaIni = '13:00:00';
  //   const timeAlarmaFin = '12:00:00';

  //   const time = `${this.today.getHours()}:${this.today.getMinutes()}:00`;
  //   console.log('time', time);
  //   if( time >= timeAlarmaIni || time <= timeAlarmaFin ){

  //     const alert = await this.alertController.create({
  //       cssClass: 'my-custom-class',
  //       header: 'Alerta',
  //       subHeader: 'Subtitle',
  //       message: 'Recuerda activar la Alarma, oprime ok para no volver a ver este mensaje',
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //     const { role } = await alert.onDidDismiss();
  //     console.log('onDidDismiss resolved with role', role);
  //   }

  // }
  return() {
    console.log('return');
    this.router.navigateByUrl('supervisor');
    // window.history.back();
  }
  // get  name sucursal
  getBranch() {
    let branchIdNumber = 0;
    branchIdNumber = Number(this.branchId);
    console.log('branchIdNumber', branchIdNumber);
    this.service.serviceGeneralGet('StockChicken/Admin/All-Branch').subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.dataBranch.forEach(element => {
          if (element.branchId === branchIdNumber) {
            this.nameBranch = element.branchName;
            this.nameBranch = this.nameBranch.toUpperCase();
            console.log('nombre', this.nameBranch);
          }
        });
      }
    });
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
    this.router.navigateByUrl('supervisor/validacion-assistencia/1');
  }
  validacionGas(id: number) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('supervisor/validacion-gas/' + id);
  }
  salonMontado(id: number) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('supervisor/salon-montado/' + id);
  }
  stockPollo(id: number) {
    this.router.navigateByUrl('supervisor/expectativa-venta/' + id);
  }
  terminarTurno() {
    this.router.navigateByUrl('supervisor');
  }
  mesas(id: number) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl(`supervisor/mesa-espera/1/${id}`);
  }
}
