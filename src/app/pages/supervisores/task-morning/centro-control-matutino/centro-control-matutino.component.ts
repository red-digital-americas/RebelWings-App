import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { LogoutComponent } from 'src/app/pages/popover/logout/logout.component';

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
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];
  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController,

  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    this.branchId = this.user.branch;
    this.getBranch();
    this.getDataControl();
  }
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.getDataControl();
  }
  getDataControl() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branch}/${this.matutino}/Manager`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('control', resp.result);
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
    this.router.navigateByUrl('supervisor/mesa-espera/' + id);
  }
}
