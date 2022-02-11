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
  @Input() objAlbaran;
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
    console.log('user', this.user);

    console.log('data que recibe', this.navParams.data);
    this.objAlbaran = this.navParams.data.objAlbaran;
    this.idStatus = this.navParams.data.idStatus;
    if (this.objAlbaran.id !== 0) {
      this.getAlbaran();
    }
  }

  ngOnInit() {}

  getAlbaran() {
    this.service
      .serviceGeneralGet('Albaran/By-Id/' + this.objAlbaran.id)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get albaran', this.data.result);
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  validateSave() {
    if (this.idStatus !== 3) {
      if (
        this.data.albaranTime === '' ||
        this.data.albaranTime === undefined ||
        this.data.albaranTime === null
      ) {
        this.activeTime = true;
      } else {
        this.activeTime = false;
      }
    }
    if (
      this.data.albaranTime === '' ||
      this.data.albaranTime === undefined ||
      this.data.albaranTime === null
    ) {
      this.activeTime = true;
    } else {
      this.activeTime = false;
    }
    if (
      this.data.albaranDescription === '' ||
      this.data.albaranDescription === undefined ||
      this.data.albaranDescription === null
    ) {
      this.activeComment = true;
    } else {
      this.activeComment = false;
    }
    if (this.idStatus !== 3) {
      if (
        this.data.albaranTime === '' ||
        this.data.albaranTime === undefined ||
        this.data.albaranDescription === '' ||
        this.data.albaranDescription === undefined
      ) {
        return;
      } else {
        this.save();
      }
    } else {
      if (this.data.albaranDescription === '' || this.data.albaranDescription === undefined) {
        return;
      } else {
        this.save();
      }
    }
  }
  getFormatTimeStamp() {
    if (this.idStatus === 3) {
      // si el estatus es no llego se asigna la hora y tiempo actual
      this.data.albaranTime = this.today;
    }
    this.data.albaranTime = new Date(this.data.albaranTime);
    console.log('time', this.data.albaranTime);

    this.datetime =
      '' +
      this.data.albaranTime.getHours() +
      ':' +
      this.data.albaranTime.getMinutes() +
      ':' +
      this.data.albaranTime.getSeconds() +
      '.' +
      this.data.albaranTime.getMilliseconds();
    console.log('timestamp', this.datetime);
  }
  save() {
    if (this.objAlbaran.id === 0) {
      this.addData();
    } else {
      this.updateData();
    }
  }
  addData() {
    this.getFormatTimeStamp();
    // albaran el modelo no es correcto aun falta por definir
    const obj = {
      id: 0,
      branchId: this.user.branch,
      albaranDate: this.objAlbaran.albaranDate,
      albaranTime: this.objAlbaran.timeArrive,
      albaranDescription: this.objAlbaran.descripcion,
      numSerie: this.objAlbaran.numSerie,
      numAlbaran: this.objAlbaran.numAlbaran,
      n: this.objAlbaran.n,
      statusId: this.idStatus,
      timeArrive: this.datetime,
      comment: this.data.albaranDescription,
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    console.log('obj', obj);
    this.service.serviceGeneralPostWithUrl('Albaran', obj).subscribe((resp) => {
      if (resp.success) {
        this.load.presentLoading('Guardando..');
        console.log('data', resp);
        this.modalController.dismiss({
          dismissed: true,
        });
      }
    });
  }
  updateData() {
    // if (this.data.timeArrive.length > 8) {
    //   this.getFormatTimeStamp();
    // }
    const obj = {
      id: this.data.id,
      albaranDate: this.objAlbaran.albaranDate,
      albaranTime: this.objAlbaran.albaranTime,
      albaranDescription: this.objAlbaran.descripcion,
      numSerie: this.objAlbaran.numSerie,
      numAlbaran: this.objAlbaran.numAlbaran,
      n: this.objAlbaran.n,
      statusId: this.idStatus,
      timeArrive: this.data.timeArrive,
      comment: this.data.albaranDescription,
      createdBy: this.data.createdBy,
      createdDate: this.data.createdDate,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    console.log('obj', obj);

    this.service.serviceGeneralPut('Albaran', obj).subscribe((resp) => {
      if (resp.success) {
        this.load.presentLoading('Actualizando Albaran..');
        console.log('data', resp);
        this.modalController.dismiss({
          dismissed: true,
        });
      }
    });
  }
}
