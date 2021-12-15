import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { DialogAddPackageComponent } from '../../dialog/dialog-add-package/dialog-add-package.component';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-sales-expectation',
  templateUrl: './sales-expectation.component.html',
  styleUrls: ['./sales-expectation.component.scss'],
})
export class SalesExpectationComponent implements OnInit {
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
      .serviceGeneralGet('StockChicken/By-Branch/' + this.idSucursal)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log(this.data);
        }
      });
    console.log('sin data');
  }
  return() {
    window.history.back();
    // this.router.navigateByUrl('supervisor/control-matutino');
  }

  async addPackage(idPack: number) {
    console.log('id paquete', idPack);
    // package = 0 es nuevo registos, si es != 0 es update
    const modal = await this.modalController.create({
      component: DialogAddPackageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        idSucursal: this.idSucursal, //se envia el id de sucursal
        idPackage: idPack,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.ionViewWillEnter();
    });
    this.modalController.dismiss();
    return await modal.present();
  }
  deletePackage(id: number) {
    this.service
      .serviceGeneralDelete('StockChicken/' + id)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('delete success', resp);
          this.load.presentLoading('Eliminando paquete..');
          this.ionViewWillEnter();
        }
      });
  }
  save() {
    this.router.navigateByUrl('supervisor/control-matutino');
  }
}
