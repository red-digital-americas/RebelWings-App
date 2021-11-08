import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  public turno;
  public data: any = [];
  constructor(
    public router: Router,
    public modalController: ModalController,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public routerActive: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    console.log('hora', this.today);
    console.log(this.routerActive.snapshot.paramMap.get('turno'));
    this.turno = this.routerActive.snapshot.paramMap.get('turno');
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

  ngOnInit() {}

  return() {
    // window.history.back();
    this.router.navigateByUrl('horario/control-matutino');
  }
  async commentAttendance(idPerson: number, claveTrabajo, nombre, trabajo) {
    const modal = await this.modalController.create({
      component: DialoAddCommentAttendanceComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id: idPerson,
        clabTrab: claveTrabajo,
        name: nombre,
        jobTitle: trabajo,
      },
    });
    return await modal.present();
  }
}


