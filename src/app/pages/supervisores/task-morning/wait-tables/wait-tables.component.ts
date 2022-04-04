import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/core/services/services/photo.service';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-wait-tables',
  templateUrl: './wait-tables.component.html',
  styleUrls: ['./wait-tables.component.scss'],
})
export class WaitTablesComponent implements OnInit {
  public user: any;
  public idTable: string;
  public today = new Date();
  public data: WaitTableModel = new WaitTableModel();
  public activeData = false;
  public turno;
  public createDate = '';



  constructor(
    public routerActive: ActivatedRoute,
    public router: Router,
    public photoService: PhotoService,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public datepipe: DatePipe
  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idTable = this.routerActive.snapshot.paramMap.get('id');
    this.turno = this.routerActive.snapshot.paramMap.get('turno');
    console.log('turno select', this.turno);
    if (this.idTable === '0') {
      console.log('Completar la tarea');
      this.activeData = true;
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }

  ngOnInit() { }

  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('WaitListTable/' + this.idTable)
      .subscribe((resp) => {
        if (resp.success) {
          this.activeData = true;
          this.data = resp.result;
          console.log('get data', this.data);
        }
      });
  }

  return() {
    // window.history.back();
    if (this.turno === '1') {
      this.router.navigateByUrl('supervisor/control-matutino');
    }
    else {
      this.router.navigateByUrl('supervisor/control-vespertino');
    }
  }

  formartDate() {
    // 2022-03-11T17:27:00
    console.log('date', this.today);
    let time = '';
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    time =
      '' +
      this.today.getHours() +
      ':' + '00' +
      // this.today.getMinutes() +
      ':' +
      this.today.getSeconds();
    console.log('format', time);
    console.log('date', date);
    this.createDate = `${date}T${time}`;
    console.log('createDate', this.createDate);
    this.addData();

    // this.data.time = datetime;
  }

  save() {
    this.data.numberPeople = 0;
    this.data.waitlistTables = true;
    this.data.branch = this.user.branchId;
    if (this.idTable === '0') {
      console.log('add data');
      this.formartDate();
    }
    else {
      this.updateData();
    }
  }
  addData() {
    console.log('turno', this.turno);

    this.data.createdBy = this.user.id;
    this.data.createdDate = this.createDate;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('post data', this.data);
    this.service
      .serviceGeneralPostWithUrl('WaitListTable', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.ngOnInit();
          if (this.turno === '1') {
            this.router.navigateByUrl('supervisor/control-matutino');
          }
          else {
            this.router.navigateByUrl('supervisor/control-vespertino');
          }
        }
      });
  }
  updateData() {
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('put data', this.data);
    this.service
      .serviceGeneralPut('WaitListTable', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.ngOnInit();
          if (this.turno === '1') {
            this.router.navigateByUrl('supervisor/control-matutino');

          }
          else {
            this.router.navigateByUrl('supervisor/control-vespertino');
          }
        }
      });
  }
}

class WaitTableModel {
  id: number;
  branch: number;
  waitlistTables: true;
  howManyTables: number;
  numberPeople: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: Date;
}
