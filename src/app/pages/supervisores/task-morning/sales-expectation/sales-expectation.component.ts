/* eslint-disable max-len */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { DialogAddPackageComponent } from '../../dialog/dialog-add-package/dialog-add-package.component';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogUpdateStockPolloComponent } from '../../dialog/dialog-update-stock-pollo/dialog-update-stock-pollo.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sales-expectation',
  templateUrl: './sales-expectation.component.html',
  styleUrls: ['./sales-expectation.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SalesExpectationComponent implements OnInit {

  public today = new Date();
  public user: any;
  public idSucursal: string;
  public disabled = false;
  public data;
  handlerRespMessage = '';
  handlerRespValor;
  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public alertController: AlertController,

  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() { }

  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`StockChicken/GetStock?id_sucursal=${this.user.branch}&dataBase=${this.user.dataBase}`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          this.data.forEach(element => {
            element.cantidad = 0;
          });
          console.log(this.data);
        }
      });
    console.log('sin data');
  }

  return() {
    window.history.back();
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
  save(item) {
    this.service
      .serviceGeneralPostWithUrl(`StockChicken/AddRegularizate?codArticulo=${item.codarticulo}&codAlmacen=${item.codalmacen}&cantidad=${item.cantidad}&dataBase=${this.user.dataBase}`, ``)
      .subscribe((resp) => {
        console.log(resp);

        if (resp.success) {

          this.load.presentLoading('Cantidad Permitida');
          this.ngOnInit();
          // this.data.status = 'post';
        }
      });
    console.log('sin data');
  }
  async validarCantidad(stock, i) {
    let respValidar;
    console.log('info de validar', stock);
    // this.load.presentLoading('Validando..');
    this.service
      .serviceGeneralGet(`StockChicken/ValidateStock?id_sucursal=${this.user.branch}&dataBase=${this.user.dataBase}&cantidad=${stock.cantidad}&codarticulo=${stock.codarticulo}`)
      .subscribe((resp) => {
        respValidar = resp;
        console.log('validar', respValidar);
        if (resp.success) {
          // stock.diferencia
          stock.diferencia = respValidar.message;
          this.openDialogValidarStock(stock);
          console.log('new valor permitida', stock);
        }
        else {
          console.log('no hay diferencia', stock);
        }
      });
    console.log('sin data');
  }
  async openDialogValidarStock(nodo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Diferencia de stock',
      // subHeader: `De: ${nodo.diferencia}`,
      message: 'Hay una diferencia entre el sistema de Gestión de Restaurantes e ICG <br> ¿Estás seguro que quieres actualizar el sistema? Se actualizarán el Stock de tu sucursal y esta acción no puede ser deshecha.',
      mode: 'ios', //sirve para tomar el diseño de ios
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { this.handlerRespMessage = 'Alert canceled'; }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { this.handlerRespMessage = 'Alert confirmed'; }
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.handlerRespValor = role;
    console.log('onDidDismiss resolved with role', this.handlerRespValor);
  }
  trackData(index, data) {
    return data ? data.id : undefined;
  }
}
