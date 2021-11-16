import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-dialog-add-transfer',
  templateUrl: './dialog-add-transfer.component.html',
  styleUrls: ['./dialog-add-transfer.component.scss'],
})
export class DialogAddTransferComponent implements OnInit {
  @Input() idRegister: number;
  @Input() branchId: number;
  @Input() type: number; // transferencia  1 request 2
  @Input() nameSucursal: string;

  // public data: TransferModel = new TransferModel();
  public data: any = [];
  public user: any;
  public today = new Date();
  public disabled = false;
  public search = '';
  public dataStatus: any[] = [];
  public selectCatalogs = [];
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
  public paquete = 'Paquete de Pollo';
  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {
    this.selectCatalogs = [
      { codarticulo: 0, descripcion: 'No hay información' },
    ];
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
    this.idRegister = this.navParams.data.id;
    this.branchId = this.navParams.data.branchId;
    this.type = this.navParams.data.type;
    this.nameSucursal = this.navParams.data.nameSucursal;
    this.getStatus();

    if (this.idRegister !== 0) {
      this.getTransfer();
    }
  }
  ngOnInit() {}

  getTransfer() {
    this.service
      .serviceGeneralGet('Transfer/' + this.idRegister)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get transfer', this.data);
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  // trae coincidencias de productos segun su busqueda
  getCatalog(search) {
    console.log('search', search);
    this.selectCatalogs = [];
    if (search.length > 2) {
      this.service
        .serviceGeneralGet(`Items/${this.user.branch}/${search}`)
        .subscribe((resp) => {
          if (resp.success) {
            console.log('get productos', resp);
            this.selectCatalogs = resp.result[2];
          }
        });
    } else {
      this.selectCatalogs = [
        { codarticulo: 0, descripcion: 'No hay información' },
      ];
      return;
    }
  }
  // status de paquete
  getStatus() {
    this.dataStatus = [];
    this.service
      .serviceGeneralGet(`Transfer/Catalogue/Status`)
      .subscribe((resp) => {
        if (resp.success) {
          // si type es 1 = transferir se quita el estatus Solicitado
          // si type es 2 = request se quita el estatus Transferido
          if (this.type === 1) {
            resp.result.forEach((element) => {
              if (element.status !== 'Solicitado') {
                this.dataStatus.push(element);
              }
            });
          } else {
            resp.result.forEach((element) => {
              if (element.status !== 'Transferido') {
                this.dataStatus.push(element);
              }
            });
          }
          console.log('get status', this.dataStatus);
        }
      });
  }
  // trae las cantidades de la bd para un autocomplete para el campo cantidad
  getWordAmount(word: string) {
    console.log('buscar coincidencias', word);
    if (word.length > 3) {
      this.service
        .serviceGeneralGet(`Transfer/Catalogue/Amount?word=${word}`)
        .subscribe((resp) => {
          if (resp.success) {
            console.log('get coincidencias', resp.result);
            if (resp.result.length === 0) {
              return;
            } else {
              this.data.amount = resp.result[0];
            }
          }
        });
    } else {
      return;
    }
  }
  getTimeSpan(){

  }
  save() {
    if (this.idRegister === 0) {
      this.addTransference();
    } else {
      this.updateTransference();
    }
  }
  //  HACER UNA TRANSFERENCIA/SOLICITAR UNA TRANSFERENCIA
  addTransference() {
    if(this.data.code === undefined ){
      this.data.code = '';
    }
    this.disabled = true;
    const obj = {
      type: this.type,
      status: this.data.status,
      fromBranchId: this.user.branch,
      toBranchId: this.branchId,
      date: this.data.date,
      time: null,
      productId: this.data.productId,
      code: this.data.code,
      amount: this.data.amount,
      comment: this.data.comment,
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    console.log('obj a guardar', obj);
    this.service
      .serviceGeneralPostWithUrl('Transfer', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.disabled = false;
          this.modalController.dismiss({
            dismissed: true,
          });
        }
      });
    this.disabled = false;
  }
  // solicitar transferencia
  updateTransference() {
    this.disabled = true;
    const obj = {
      type: this.data.type,
      status: this.data.status,
      fromBranchId: this.user.branch,
      toBranchId: this.branchId,
      date: this.data.date,
      time: null,
      productId: this.data.productId,
      code: this.data.code,
      amount: this.data.amount,
      comment: this.data.comment,
      createdBy: this.data.createdBy,
      createdDate: this.data.createdDate,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    console.log('obj a guardar', obj);
    this.service.serviceGeneralPut('Transfer', obj).subscribe((resp) => {
      if (resp.success) {
        this.load.presentLoading('Actualizando ..');
        console.log('data', resp);
        this.modalController.dismiss({
          dismissed: true,
        });
      }
    });
  }
}
// class TransferModel {
//   id: number;
//   type: number;
//   fromBranchId: number;
//   toBranchId: number;
//   date: Date;
//   time: Timestamp;
//   productId: number;
//   code: string;
//   amount: string;
//   comment: string;
//   createdBy: 0;
//   createdDate: Date;
//   updatedBy: 0;
//   updatedDate: Date;
// }
