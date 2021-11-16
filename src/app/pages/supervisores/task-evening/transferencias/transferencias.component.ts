import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { DialogAddTransferComponent } from '../../dialog/dialog-add-transfer/dialog-add-transfer.component';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

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
  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() {}
  getData() {
    this.service
      .serviceGeneralGet('Transfer/BranchList/' + this.idSucursal)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log(this.data);
        }
      });
    console.log('sin data');
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('horario/control-vespertino');
  }

  async addTransfer(idRT: number, idBranch: number, idtype: number, nameSuc: string) {
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
      this.ngOnInit();
    });
    this.modalController.dismiss();
    return await modal.present();
  }
}
