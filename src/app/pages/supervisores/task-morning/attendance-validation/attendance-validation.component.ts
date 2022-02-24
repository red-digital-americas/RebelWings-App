import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DialoAddCommentAttendanceComponent } from '../../dialog/dialo-add-comment-attendance/dialo-add-comment-attendance.component';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { LoaderGeneralService } from 'src/app/pages/dialog-general/loader-general.service';
@Component({
  selector: 'app-attendance-validation',
  templateUrl: './attendance-validation.component.html',
  styleUrls: ['./attendance-validation.component.scss'],
})
export class AttendanceValidationComponent implements OnInit {
  public today = new Date();
  public user;
  public turno;
  public data: any[] = [];
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];

  constructor(
    public router: Router,
    public modalController: ModalController,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public loader: LoaderGeneralService,
    public routerActive: ActivatedRoute
  ) { }

  ionViewWillEnter() {
    console.log('hora', this.today);
    console.log(this.routerActive.snapshot.paramMap.get('turno'));
    this.turno = this.routerActive.snapshot.paramMap.get('turno');
    this.user = JSON.parse(localStorage.getItem('userData'));
    // get nema de sucursal
    this.branchId = this.user.branch;
    this.getBranch();

    this.service
      .serviceGeneralGet(`ValidateAttendance/All/${this.user.branch}`)
      .subscribe((resp) => {
        this.loader.loadingPresent();
        if (resp.success) {
          this.data = resp.result;
          console.log('resp', this.data);
          if (this.data.length === 0) {
            this.data.push({
              jobTitle: 'No data'
            });
          }
          this.loader.loadingDismiss();
        }
        else {
          console.log('no data');
          this.data.push({
            jobTitle: 'No data'
          });
          this.loader.loadingDismiss();
        }
      }, error =>{
        console.log('Error', error);

      });
  }

  ngOnInit() { }

  return() {
    window.history.back();
    // this.router.navigateByUrl('supervisor/control-matutino');
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
    this.ionViewWillEnter();
    return await modal.present();
  }
  // get  name sucursal
  getBranch() {
    let branchIdNumber = 0;
    branchIdNumber = Number(this.branchId);
    console.log('branchIdNumber', branchIdNumber);
    this.service.serviceGeneralGet('StockChicken/Admin/All-Branch').subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.dataBranch.forEach(element => {
          if (element.branchId === branchIdNumber) {
            this.nameBranch = element.branchName;
            this.nameBranch = this.nameBranch.toUpperCase();
            console.log('nombre', this.nameBranch);
          }
        });
      }
    },
       error => {
        console.log('Error', error);
      }
    );
  }
}


