import { ModalController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-dialo-add-comment-attendance',
  templateUrl: './dialo-add-comment-attendance.component.html',
  styleUrls: ['./dialo-add-comment-attendance.component.scss'],
})
export class DialoAddCommentAttendanceComponent implements OnInit {
  @Input() id: number;
  public data: AttendanceModel = new AttendanceModel();
  public dataPerson: any = [];
  public user;
  public clabTrab: number;
  public today = new Date();

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public servicio: ServiceGeneralService,
    public load: LoaderComponent
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.load.presentLoading('Cargando..');
    console.log('data que recibe', this.navParams.data);
    this.clabTrab = this.navParams.data.clabTrab;
    if (this.navParams.data.id !== 0) {
      this.getData();
    } else {
      this.data.attendence = 1;
    }
  }

  getData() {
    this.load.presentLoading('Cargando..');
    this.servicio
      .serviceGeneralGet(`ValidateAttendance/${this.id}`)
      .subscribe((resp) => {
        if (resp.success) {
          console.log('get data', resp);
          this.data = resp.result;
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  save() {
    this.data.branchId = this.user.branch;
    this.data.clabTrab = this.clabTrab;
    this.data.time = this.today;
    if (this.navParams.data.id === 0) {
      // add
      this.addComment();
    } else {
      // update
      this.updateComment();
    }
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  addComment() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.servicio
      .serviceGeneralPostWithUrl('ValidateAttendance', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.dismiss();
        }
      });
  }
  updateComment() {
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.servicio
      .serviceGeneralPut('ValidateAttendance', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.dismiss();
        }
      });
  }
}

class AttendanceModel {
  id: number;
  branchId: number;
  attendence: number;
  clabTrab: number;
  time: Date;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
