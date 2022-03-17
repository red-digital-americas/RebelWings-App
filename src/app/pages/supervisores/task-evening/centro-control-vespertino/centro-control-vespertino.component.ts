import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogNotificationComponent } from 'src/app/pages/nav/dialog-notification/dialog-notification.component';
import { LogoutComponent } from 'src/app/pages/popover/logout/logout.component';

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
  public nameBranch = '';
  public dataBranch: any[] = [];

  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,

  ) {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    this.branchId = this.user.branchId;
    this.getBranch();

    this.getDataControl();
    this.getNotification();
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.getDataControl();
    this.getNotification();
  }
  getDataControl() {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branchId}/${this.vespertino}/Manager`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('control vespertino', resp.result);
          this.data = resp.result;
        }
      });
  }
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
    this.router.navigateByUrl('supervisor/remisiones/' + id);
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
    this.router.navigateByUrl('supervisor/producto-riesgo/' + id);
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
    this.router.navigateByUrl('supervisor/transferencias/' + id);
  }
  voladoEfectivo(id) {
    if (id === null) {
      id = 0;
    }
    this.router.navigateByUrl('supervisor/volado-efectivo/' + id);
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
