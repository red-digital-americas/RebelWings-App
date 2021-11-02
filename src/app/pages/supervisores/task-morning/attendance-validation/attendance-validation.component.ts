import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DialoAddCommentAttendanceComponent } from '../../dialog/dialo-add-comment-attendance/dialo-add-comment-attendance.component';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-attendance-validation',
  templateUrl: './attendance-validation.component.html',
  styleUrls: ['./attendance-validation.component.scss'],
})
export class AttendanceValidationComponent implements OnInit {
  public today = new Date();
  public user;
  public data: any = [];
  public dataAttendance = {
    success: true,
    message: 'string',
    result: [
      {
        id: 1,
        avatar:
          './assets/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
        name: 'Ignacio Martín Lopez',
        work: 'Cocinero',
        turno: 'Matutino',
        retardos: '1',
        status: 'llego',
        hora: 'Fri Oct 22 2021 08:04:13 GMT-0500',
        icon: './assets/icon/icon_asisti.png',
      },
      {
        id: 2,
        avatar:
          './assets/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
        name: 'Sergio Rebollo Mendez',
        work: 'Cocinero',
        turno: 'Matutino',
        retardos: '0',
        status: 'No llegó',
        hora: 'Fri Oct 22 2021 08:04:13 GMT-0500',
        icon: './assets/icon/icon_falt.png',
      },
      {
        id: 3,
        avatar:
          './assets/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
        name: 'Lorena Fernandez Vargas',
        work: 'Mesero',
        turno: 'Matutino',
        retardos: '1',
        status: 'Tarde',
        hora: 'Fri Oct 22 2021 08:04:13 GMT-0500',
        icon: './assets/icon/icon_lleg_tarde.png',
      },
      {
        id: 4,
        avatar:
          './assets/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg',
        name: 'Berenice Marin Salinas',
        work: 'Cocinero',
        turno: 'Matutino',
        retardos: '0',
        status: 'llego',
        hora: 'Fri Oct 22 2021 08:04:13 GMT-0500',
        icon: './assets/icon/icon_asisti.png',
      },
    ],
  };
  constructor(
    public router: Router,
    public modalController: ModalController,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ngOnInit() {
    console.log('hora', this.today);
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ValidateAttendance/All/${this.user.branch}`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('resp', this.data);
        }
      });
  }

  return() {
    // window.history.back();
    this.router.navigateByUrl('horario/control-matutino');
  }
  async commentAttendance(idPerson: number) {
    const modal = await this.modalController.create({
      component: DialoAddCommentAttendanceComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id: idPerson,
      },
    });
    return await modal.present();
  }
  save() {
    this.router.navigateByUrl('horario/control-matutino');
  }
}
