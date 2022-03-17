import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonSelect } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-dialog-view-transfer',
  templateUrl: './dialog-view-transfer.component.html',
  styleUrls: ['./dialog-view-transfer.component.scss'],
})
export class DialogViewTransferComponent implements OnInit {
  @Input() id: number;
  public data: TransferModel = new TransferModel();
  public user;
  public dataBranch: any[] = [];
  public dataStatus: any[] = [];
  public nameSucursal;
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = [
    's\u00f8n',
    'man',
    'tir',
    'ons',
    'tor',
    'fre',
    'l\u00f8r',
  ];
  customPickerOptions: any;
  constructor(public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent) {
    this.customPickerOptions = {
      buttons: [
        {
          text: 'Guardar',
          handler: () => console.log('Clicked Save!'),
        },
        {
          text: 'Log',
          handler: () => {
            console.log('Clicked Log. Do not Dismiss.');
            return false;
          },
        },
      ],
    };
  }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    console.log('data que recibe', this.navParams.data);
    this.getData();
    this.getStatus();
  }
  ngOnInit() { }
  getData() {
    this.service
      .serviceGeneralGet('Transfer/' + this.navParams.data.id)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get transfer', this.data);
          this.getBranch();

        }
      });
  }
  getStatus() {
    this.dataStatus = [];
    this.service
      .serviceGeneralGet(`Transfer/Catalogue/Status`)
      .subscribe((resp) => {
        if (resp.success) {
          this.dataStatus = resp.result;
          console.log('get status', this.dataStatus);
        }
      });
  }
  // get  name sucursal
  getBranch() {
    this.service.serviceGeneralGet('StockChicken/Admin/All-Branch').subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.getName(this.data.toBranchId);
      }
    });
  }
  getName(id: number) {
    this.dataBranch.forEach(element => {
      if (element.branchId === id) {
        this.nameSucursal = element.branchName;
        this.nameSucursal = this.nameSucursal.toUpperCase();
        console.log('nombre from', this.nameSucursal);
      }
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

}
class TransferModel {
  id: number;
  type: number;
  status: number;
  fromBranchId: number;
  toBranchId: number;
  date: Date;
  time: string;
  productId: number;
  product: string;
  code: string;
  amount: string;
  comment: string;
  createdBy: 0;
  createdDate: Date;
  updatedBy: 0;
  updatedDate: Date;
}
