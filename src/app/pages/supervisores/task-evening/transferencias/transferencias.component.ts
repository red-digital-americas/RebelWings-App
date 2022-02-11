import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { DialogAddTransferComponent } from '../../dialog/dialog-add-transfer/dialog-add-transfer.component';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { PopoverTransferRequestComponent } from '../../popover/popover-transfer-request/popover-transfer-request.component';
@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss'],
})
export class TransferenciasComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: any[] = [];
  public idSucursal: string;
  public disabled = false;
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];
  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController
  ) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    // get nema de sucursal
    this.branchId = this.user.branch;
    this.getBranch();
    this.getData();
  }
  ngOnInit() {}
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Transfer/BranchList/' + this.user.branch)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log(this.data);
        }
      });
    console.log('sin data', this.data);
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-vespertino');
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
  async openNotification(ev: any, obj, idType, branch) {
    console.log('data', obj, 'type', idType);
    const popover = await this.popoverCtrl.create({
      component: PopoverTransferRequestComponent,
      cssClass: 'my-custom-class',
      event: ev,
      componentProps: {
        data: obj, //se envia el nodo de sucursal
        type: idType,
        idBranch: branch
      },
      translucent: true,
      mode: 'ios', //sirve para tomar el diseño de ios
      backdropDismiss: true,
    });
    await popover.present();
    // regresa la respuesta del popover
    //didDismis sirve tare respuesta cuando se cierra el popover
    // const { data } = await popover.onDidDismiss();
    // onwillDismiss trae la respuesta en cuando seleccionas la opcion del popover osea es mas rapido
    const { data } = await popover.onWillDismiss();
    console.log('Respuesta de popover', data);
    // al elegir una opcion en popover abrir modal de transferencia
    if(data !== undefined){
      this.addTransfer(data.id, branch, data.type, '' );
    }
  }

  //  ************* Abre modal para request y transfer ****************
  async addTransfer(
    idRT: number,
    idBranch: number,
    idtype: number,
    nameSuc: string
  ) {
    // idRT = id del registro ya sea trans o reque
    // idBranch = id de sucursal
    // idtype = transfer = 1 y request = 2
    console.log(
      `Data recibida id ${idRT} idBranch ${idBranch} idtype ${idtype}`
    );
    // package = 0 es nuevo registos, si es != 0 es update
    const modal = await this.modalController.create({
      component: DialogAddTransferComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id: idRT, //se envia el id de sucursal
        branchId: idBranch,
        type: idtype,
        nameSucursal: nameSuc,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.ionViewWillEnter();
    });
    this.modalController.dismiss();
    return await modal.present();
  }
}
