import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-dialog-add-albaranes',
  templateUrl: './dialog-add-albaranes.component.html',
  styleUrls: ['./dialog-add-albaranes.component.scss'],
})
export class DialogAddAlbaranesComponent implements OnInit {
  @Input() nombre: string;
  @Input() idAlbaran: number;
  @Input() idStatus: number;
  public disabled = false;

  public data: any = [];
  public user: any;
  public today = new Date();
  public dataStatus: any[] = [];
  public datetime;

  // ******variables de validacion ********
  public activeTime = false;
  public activeComment = false;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('data que recibe', this.navParams.data);
    this.idAlbaran = this.navParams.data.idAlbaran;
    this.idStatus = this.navParams.data.idSucursal;
    this.nombre = this.navParams.data.nombre;
    if (this.idAlbaran !== 0) {
      this.getAlbaran();
    }
  }

  ngOnInit() {}

  getAlbaran() {
    this.service
      .serviceGeneralGet('StockChicken/' + this.idAlbaran)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get stock', this.data);
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  validateSave() {
    if (
      this.data.time === '' ||
      this.data.time === undefined ||
      this.data.time === null
    ) {
      this.activeTime = true;
    } else {
      this.activeTime = false;
    }
    if (
      this.data.time === '' ||
      this.data.time === undefined ||
      this.data.time === null
    ) {
      this.activeTime = true;
    } else {
      this.activeTime = false;
    }
    if (
      this.data.comment === '' ||
      this.data.comment === undefined ||
      this.data.comment === null
    ) {
      this.activeComment = true;
    } else {
      this.activeComment = false;
    }
    if (
      this.data.time === '' ||
      this.data.time === undefined ||
      this.data.comment === '' ||
      this.data.comment === undefined
    ) {
      return;
    } else {
      this.save();
    }
  }
  save() {
    if (this.idAlbaran === 0) {
      this.addPackage();
    } else {
      this.updatePackage();
    }
  }
  addPackage() {
    const obj = {
      branch: this.idStatus,
      code: this.data.code,
      amount: this.data.amount,
      statusId: 1, //aun no esta definido
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    this.service
      .serviceGeneralPostWithUrl('StockChicken', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.modalController.dismiss({
            dismissed: true,
          });
        }
      });
  }
  updatePackage() {
    const obj = {
      id: this.data.id,
      amount: this.data.amount,
      userId: this.user.id,
    };
    this.service
      .serviceGeneralPut('StockChicken/Package-Used', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Actualizando stock..');
          console.log('data', resp);
          this.modalController.dismiss({
            dismissed: true,
          });
        }
      });
  }
}
