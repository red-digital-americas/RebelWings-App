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
  public data: any = [];
  public dataPerson: any = [];

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public servicio: ServiceGeneralService,
    public load: LoaderComponent
  ) {}
  ngOnInit() {
    this.load.presentLoading('Cargando..');
    console.log('data que recibe', this.navParams.data);
    // this.getData();
    // this.dataAttendance.result.forEach((element) => {
    //   if (element.id === this.navParams.data.id) {
    //     this.dataPerson = element;
    //   }
    // });
  }

  getData() {
    this.servicio.serviceGeneralGet(`ValidateAttendance/${this.id}`).subscribe( resp => {
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
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
