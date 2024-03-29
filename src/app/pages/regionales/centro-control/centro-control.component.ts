import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogNotificationComponent } from 'src/app/pages/nav/dialog-notification/dialog-notification.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { LogoutComponent } from '../../popover/logout/logout.component';

@Component({
  selector: 'app-centro-control',
  templateUrl: './centro-control.component.html',
  styleUrls: ['./centro-control.component.scss'],
})
export class CentroControlComponent implements OnInit {
  public user: any;
  public data: any[] = [];
  public barProgressTask: number;
  public color: string;
  public dataNotification: any = [];
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
  // variable menu seleccionable
  public task;

  constructor(
    public router: Router, public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,

  ) { }
  // segment
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    console.log(this.routerActive.snapshot.paramMap.get(`id`));
    this.branchId = this.routerActive.snapshot.paramMap.get(`id`);
    this.task = this.routerActive.snapshot.paramMap.get(`idTarea`);
    this.getDataControl(this.task);
    this.getBranch(this.user.stateId);
    this.getNotification();
  }
  ngOnInit() { }
  // obtiene el estatus de cada tarea
  getDataControl(task) {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.branchId}/${task}/Regional`)
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
          console.log('control vespertino', resp.result);
        }
      });
  }
  return() {
    console.log('return');
    this.router.navigateByUrl('regional');
    // window.history.back();
  }
  levantamientoTicket() {
    this.router.navigateByUrl('regional/levantamiento-ticket/' + this.branchId);
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
        id: this.branchId, //se envia el id de sucursal
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
  // notificaciones de regional
  getNotification() {
    this.service
      .serviceGeneralGet('Transfer/Notifications?id=' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          this.dataNotification = resp.result;
          console.log('notificaciones', this.dataNotification);
        }
      });
  }
  ticketList(){
    this.router.navigateByUrl('historial-ticket/' + this.branchId);
  }
  // get  name sucursal
  getBranch(id) {
    let branchIdNumber = 0;
    branchIdNumber = Number(this.branchId);
    console.log('branchIdNumber', branchIdNumber);
    this.service.serviceGeneralGet(`User/GetSucursalList?idState=${id}`).subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.dataBranch.forEach(element => {
          if (element.idfront === branchIdNumber) {
            this.nameBranch = element.titulo;
            this.nameBranch = this.nameBranch.toUpperCase();
            console.log('nombre', this.nameBranch);
          }
        });
      }
    });
  }
  //----------------------tareas de cocina---------------------
  ordenCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/ordenes/' + this.branchId);
  }
  refrigeradorCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/refrigeradores-cocina/' + this.branchId);
  }
  polloPrecoccionCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/pollo-precoccion/' + this.branchId);
  }
  productosCompletosCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/productos-completos-orden/' + this.branchId);
  }
  limpiezaFreidorasCocina() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-freidoras/' + this.branchId);
  }
  //----------------------tareas de salon---------------------
  conteoPersonasSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/conteo-personas/' + this.branchId);
  }
  encuestaSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/encuesta/' + this.branchId);
  }
  limpiezaGeneralSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-general/' + this.branchId);
  }
  estacionSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/estacion/' + this.branchId);
  }
  temperaturaBebidaSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/temperatura-bebidas/' + this.branchId);
  }
  audioVideoSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/audio-video/' + this.branchId);
  }
  focosSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/focos/' + this.branchId);
  }
  limpiezaBarraSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/limpieza-barra/' + this.branchId);
  }
  refrigeradoresSalon() {
    // if (id === null) {
    //   id = 0;
    // }
    this.router.navigateByUrl('regional/refrigeradores-salon/' + this.branchId);
  }

  //---------------------- baño---------------------

  lavabosBano() {
    this.router.navigateByUrl('regional/lavabos-jabon-papel/' + this.branchId);
  }
  estadoGeneral() {
    this.router.navigateByUrl('regional/estado-general/' + this.branchId);
  }
  //---------------------- sistema y caja---------------------
  ticketMesa() {
    this.router.navigateByUrl('regional/ticket-mesa/' + this.branchId);
  }
  entradasCargadas() {
    this.router.navigateByUrl('regional/entradas-cargadas/' + this.branchId);
  }
  revisionPedido() {
    this.router.navigateByUrl('regional/revision-pedido/' + this.branchId);
  }
  revisionMesas() {
    this.router.navigateByUrl('regional/revision-mesas/' + this.branchId);
  }
  //---------------------- MANTENIMIENTO---------------------
  cocinaMantenimiento() {
    this.router.navigateByUrl('regional/cocina-mantenimiento/' + this.branchId);
  }
  salonMantenimiento() {
    this.router.navigateByUrl('regional/salon-mantenimiento/' + this.branchId);
  }
  banosMantenimiento() {
    this.router.navigateByUrl('regional/baño-mantenimiento/' + this.branchId);
  }
  barraMantenimiento() {
    this.router.navigateByUrl('regional/barra-mantenimiento/' + this.branchId);
  }
  async cerrarSesion() {
    console.log('cerrar sesion');
    localStorage.removeItem('userData');
    this.router.navigateByUrl('login');
  }

}
