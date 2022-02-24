import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/core/services/services/photo.service';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
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

  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];

  constructor(
    public routerActive: ActivatedRoute,
    public router: Router,
    public photoService: PhotoService,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idTable = this.routerActive.snapshot.paramMap.get('id');
    // get name de sucursal
    this.branchId = this.user.branch;
    this.getBranch();
    if (this.idTable === '0') {
      console.log('Completar la tarea');
      this.activeData = true;
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }

  ngOnInit() {}

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
    window.history.back();
    // this.router.navigateByUrl('supervisor/control-matutino');
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
    });
  }

  save() {
    console.log('toggle', this.data.waitlistTables);
    if (this.idTable === '0'){
      console.log('add data');
      this.addData();
    }
    else{
      this.updateData();
    }
  }
  addData(){
    this.data.createdBy = this.user.id;
    this.data.createdDate =  this.today;
    this.data.updatedBy =  this.user.id;
    this.data.updatedDate= this.today;
    console.log('post data', this.data);
    this.service
      .serviceGeneralPostWithUrl('WaitListTable', this.data)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.ngOnInit();
          this.router.navigateByUrl('supervisor/control-matutino');
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
          this.router.navigateByUrl('supervisor/control-matutino');
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
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
