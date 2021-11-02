import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-dialog-add-package',
  templateUrl: './dialog-add-package.component.html',
  styleUrls: ['./dialog-add-package.component.scss'],
})
export class DialogAddPackageComponent implements OnInit {
  @Input() idSucursal: number;
  @Input() idPackage: number;
  public disabled = false;

  public data: any = [];
  public user: any;
  public today = new Date();

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('data que recibe', this.navParams.data);
    this.idSucursal = this.navParams.data.idSucursal;
    this.idPackage = this.navParams.data.idPackage;
    if (this.idPackage !== 0) {
      this.getPackage();
    }
  }

  getPackage() {
    this.service
      .serviceGeneralGet('StockChicken/' + this.idPackage)
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
  save() {
    if (this.idPackage === 0) {
      this.addPackage();
    } else {
      this.updatePackage();
    }
  }

  addPackage() {
    const obj = {
      branch: this.idSucursal,
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
