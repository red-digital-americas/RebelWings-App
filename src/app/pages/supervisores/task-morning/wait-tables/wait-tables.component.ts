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
    const hour = this.today.getHours();
    const minute = this.today.getMinutes();
    let hourString = hour.toString();
    let minuteString = minute.toString();
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');

    if (hourString.length < 2) {
      hourString = `0${hourString}`;
    }
    if (minuteString.length < 2) {
      minuteString = `0${minuteString}`;
    }

    console.log('hour', hourString);
    console.log('minute', minuteString);
    time = `${hourString}:${minuteString}:00`;
    console.log('date', date);
    this.createDate = `${date}T${time}`;
    console.log('createDate', this.createDate);
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.createDate;
    if (this.idTable === '0') {
      console.log('add data');
      this.addData();
    }
    else {
      this.updateData();
    }

    // this.data.time = datetime;
  }

  save() {
    this.data.howManyTables = 0;
    this.data.waitlistTables = true;
    this.data.branch = this.user.branchId;
    this.formartDate();
    // if (this.idTable === '0') {
    //   console.log('add data');
    //   this.formartDate();
    // }
    // else {
    //   this.updateData();
    // }
  }
  addData() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.createDate;
    console.log('Obj a guardar =>', this.data);
    this.service
      .serviceGeneralPostWithUrl('WaitListTable', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('Resp Serv =>', resp);
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
    console.log('Obj a guardar =>', this.data);
    this.service
      .serviceGeneralPut('WaitListTable', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('Resp Serv =>', resp);
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
  updatedDate: string;
}
