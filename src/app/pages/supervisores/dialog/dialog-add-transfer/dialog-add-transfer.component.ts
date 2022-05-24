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
  @Input() type: number; //  transfer = 2 y request = 1

  @Input() nameSucursal: string;
  @ViewChild('mySelect') selectRef: IonSelect;

  public data: TransferModel = new TransferModel();
  // public data: any = [];
  public user: any;
  public today = new Date();
  public disabled = false;
  public search = '';
  public dataStatus: any[] = [];
  public selectCatalogs = [];
  public datetime;
  public visible = false;

  // sirve solo para el update identifica si la hora cambio
  public timestamp;

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
  // public activeCode = false;
  public activeAmount = false;
  public activeComment = false;
  // nombre de sucursal
  public fromBranch = '';
  public toBranch = '';
  public dataBranch: any[] = [];

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
    this.getBranch();
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
          this.getCatalog(this.data.product);
          // para identificar que se cambio la hora igualamos variables
          this.timestamp = this.data.time;
          this.getFomName();
          this.getToName();
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  // get  name sucursal
  getBranch() {
    this.service
      .serviceGeneralGet('StockChicken/Admin/All-Branch')
      .subscribe((resp) => {
        if (resp.success) {
          this.dataBranch = resp.result;
          console.log('get branch', this.dataBranch);
          this.getName();
        }
      });
  }
  getName() {
    this.dataBranch.forEach((element) => {
      if (element.branchId === this.user.branchId) {
        this.nameSucursal = element.branchName;
        this.nameSucursal = this.nameSucursal.toUpperCase();
        console.log('nombre from', this.nameSucursal);
      }
    });
  }
  getFomName() {
    this.dataBranch.forEach((element) => {
      if (element.branchId === this.data.fromBranchId) {
        this.fromBranch = element.branchName;
        this.fromBranch = this.fromBranch.toUpperCase();
        console.log('nombre from', this.fromBranch);
      }
    });
  }
  getToName() {
    this.dataBranch.forEach((element) => {
      if (element.branchId === this.data.toBranchId) {
        this.toBranch = element.branchName;
        this.toBranch = this.toBranch.toUpperCase();
        console.log('nombre from', this.toBranch);
      }
    });
  }
  /*
  trae coincidencias de productos segun su busqueda

  */

  getCatalog(search) {
    let searchLength = 0;
    console.log('search', search);
    this.selectCatalogs = [];
    if (search.length > 2) {
      searchLength = search.length - 1;
      console.log('position', searchLength);
      this.service
        .serviceGeneralGet(`Items/${this.user.branchId}/${search}`)
        .subscribe((resp) => {
          if (resp.success) {
            console.log('get productos', resp);
            this.selectCatalogs = resp.result[searchLength];
            console.log('value catalogo', this.selectCatalogs);
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
          this.dataStatus = resp.result;
          // si type es 1 = transferir se quita el estatus Solicitado
          // si type es 2 = request se quita el estatus Transferido
          // if (this.type === 1) {
          //   resp.result.forEach((element) => {
          //     if (element.status !== 'Solicitado') {
          //       this.dataStatus.push(element);
          //     }
          //   });
          // } else {
          //   resp.result.forEach((element) => {
          //     if (element.status !== 'Transferido') {
          //       this.dataStatus.push(element);
          //     }
          //   });
          // }
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
    // if (
    //   this.data.status === undefined ||
    //   this.data.status === null
    // ) {
    //   this.activeStatus = true;
    // } else {
    //   this.activeStatus = false;
    // }
    // if (
    //   this.data.date === undefined ||
    //   this.data.date === null
    // ) {
    //   this.activeDate = true;
    // } else {
    //   this.activeDate = false;
    // }
    // if (
    //   this.data.time === '' ||
    //   this.data.time === undefined ||
    //   this.data.time === null
    // ) {
    //   this.activeTime = true;
    // } else {
    //   this.activeTime = false;
    // }
    if (this.data.productId === undefined || this.data.productId === null) {
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
      // this.data.status === undefined ||
      // this.data.date === undefined ||
      // this.data.time === '' ||
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
    let time = '';
    const hour = this.today.getHours();
    const minute = this.today.getMinutes();
    let hourString = hour.toString();
    let minuteString = minute.toString();

    if (hourString.length < 2) {
      hourString = `0${hourString}`;
    }
    if (minuteString.length < 2) {
      minuteString = `0${minuteString}`;
    }
    console.log('hour', hourString);
    console.log('minute', minuteString);
    // hour = this.today.getHours();
    // minute = this.today.getMinutes();

    time = `${hourString}:${minuteString}:00`;
    this.data.time = time;
    // this.data.time = new Date(this.data.time);
    // "15:55"
    // if (this.data.time.length === 5) {
    //   console.log('time', this.data.time);
    //   let datetime = '';
    //   datetime = `${this.data.time}:00`;
    //   this.data.time = datetime;
    // }
    //   '' +
    //   this.data.time.getHours() +
    //   ':' +
    //   this.data.time.getMinutes() +
    //   ':' + 0 + '';
    // this.data.time.getSeconds();
    console.log('timestamp', this.data.time);
  }
  //  HACER UNA TRANSFERENCIA/SOLICITAR UNA TRANSFERENCIA
  addTransference() {
    this.getFormatTimeStamp();
    // ya que solo se pueden crear solicitudes id 1 entonces el status y el type es id 1
    this.data.type = 1;
    this.data.status = 1;
    this.data.date = this.today;
    this.data.fromBranchId = this.user.branchId;
    this.data.toBranchId = this.branchId;
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;

    if (this.data.code === undefined) {
      this.data.code = '';
    }
    this.disabled = true;
    console.log('obj a guardar', this.data);
    this.service
      .serviceGeneralPostWithUrl('Transfer', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.disabled = false;
          this.ionViewWillEnter();
          this.modalController.dismiss({
            dismissed: true,
          });
        }
      });
    this.disabled = false;
  }
  updateTransference() {
    // si la variable time se modifico se agrega formato
    // if (this.data.time !== this.timestamp) {
    //   this.getFormatTimeStamp();
    // }
    this.data.type = this.data.status;
    this.data.fromBranchId = this.user.branchId;
    this.data.toBranchId = this.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.disabled = true;

    console.log('obj a guardar', this.data);
    this.service.serviceGeneralPut('Transfer', this.data).subscribe((resp) => {
      if (resp.success) {
        this.load.presentLoading('Actualizando ..');
        console.log('data', resp);
        this.ionViewWillEnter();
        this.modalController.dismiss({
          dismissed: true,
        });
      }
    });
  }
}
class TransferModel {
  id: number;
  type: number;
  status: number;
  product: string;
  fromBranchId: number;
  toBranchId: number;
  date: Date;
  time: string;
  productId: number;
  code: string;
  amount: string;
  comment: string;
  createdBy: 0;
  createdDate: Date;
  updatedBy: 0;
  updatedDate: Date;
}
