import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams, IonSelect } from '@ionic/angular';
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
  @ViewChild('mySelect') selectRef: IonSelect;

  // public data: TransferModel = new TransferModel();
  public data: any = [];
  public user: any;
  public today = new Date();
  public disabled = false;
  public search = '';
  public dataStatus: any[] = [];
  public selectCatalogs = [];
  public datetime;
  public visible = false;

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
  // ******variables de validacion ********
  public activeStatus = false;
  public activeDate = false;
  public activeTime = false;
  public activeProductId = false;
  public activeCode = false;
  public activeAmount = false;
  public activeComment = false;

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
  ngOnInit() { }

  getTransfer() {
    this.service
      .serviceGeneralGet('Transfer/' + this.idRegister)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get transfer', this.data);
          // document.getElementById('clickSearch').click();
          // this.selectRef.close();
          this.getCatalog(this.data.product);
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
            this.visible = true;
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
            if (resp.result?.length === 0 || resp.result === null) {
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

  validateSave() {
    if (
      this.data.type === '' ||
      this.data.type === undefined ||
      this.data.type === null
    ) {
      this.activeStatus = true;
    } else {
      this.activeStatus = false;
    }
    if (
      this.data.date === '' ||
      this.data.date === undefined ||
      this.data.date === null
    ) {
      this.activeDate = true;
    } else {
      this.activeDate = false;
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
      this.data.time === '' ||
      this.data.time === undefined ||
      this.data.time === null
    ) {
      this.activeTime = true;
    } else {
      this.activeTime = false;
    }
    if (
      this.data.productId === '' ||
      this.data.productId === undefined ||
      this.data.productId === null
    ) {
      this.activeProductId = true;
    } else {
      this.activeProductId = false;
    }
    if (
      this.data.amount === '' ||
      this.data.amount === undefined ||
      this.data.amount === null
    ) {
      this.activeAmount = true;
    } else {
      this.activeAmount = false;
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
      this.data.type === '' ||
      this.data.type === undefined ||
      this.data.date === '' ||
      this.data.date === undefined ||
      this.data.time === '' ||
      this.data.time === undefined ||
      this.data.productId === '' ||
      this.data.productId === undefined ||
      this.data.amount === '' ||
      this.data.amount === undefined ||
      this.data.comment === '' ||
      this.data.comment === undefined
    ) {
      return;
    } else {
      this.save();
    }
  }

  save() {
    if (this.idRegister === 0) {
      this.addTransference();
    } else {
      this.updateTransference();
    }
  }
  getFormatTimeStamp() {
    this.data.time = new Date(this.data.time);
    console.log('time', this.data.time);
    let datetime = '';
    datetime =
      '' +
      this.data.time.getHours() +
      ':' +
      this.data.time.getMinutes() +
      ':' +
      this.data.time.getSeconds() +
      '.' +
      this.data.time.getMilliseconds();
    console.log('timestamp', datetime);
    this.data.time = datetime;
  }
  //  HACER UNA TRANSFERENCIA/SOLICITAR UNA TRANSFERENCIA
  addTransference() {
    this.getFormatTimeStamp();
    if (this.data.code === undefined) {
      this.data.code = '';
    }
    this.disabled = true;
    const obj = {
      type: this.data.type,
      status: this.data.type,
      fromBranchId: this.user.branch,
      toBranchId: this.branchId,
      date: this.data.date,
      time: this.data.time,
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
  sliceHora(){
    let time = '';
    time = this.data.time;
    time = time.slice(0, 12);
    this.data.time = time;
    console.log('slice time', this.data.time);
  }

  updateTransference() {
    if (this.data.time.length > 8) {
      this.sliceHora();
    }else{
      this.getFormatTimeStamp();
    }
    // this.data.time = this.data.time.Timestamp;
    this.disabled = true;
    const obj = {
      id: this.data.id,
      type: this.data.type,
      status: this.data.type,
      fromBranchId: this.user.branch,
      toBranchId: this.branchId,
      date: this.data.date,
      // time: this.datetime,
      time: this.data.time,
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
