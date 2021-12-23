import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-conteo-personas-salon',
  templateUrl: './conteo-personas-salon.component.html',
  styleUrls: ['./conteo-personas-salon.component.scss'],
})
export class ConteoPersonasSalonComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idBranch: string;
  public data: CountPersonModel = new CountPersonModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public disabled = false;
  public activeData = false;
  // ******variables de validacion ********
  public activeMesas = false;
  public activeComensales = false;

  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idBranch = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() { }
  getData() {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('PeopleCounting/' + this.idBranch)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            this.activeData = true;
            console.log('si hay registros del dia');
            this.data = resp.result[0];
            console.log('get data', this.data);
          }
          else {
            console.log('Completar la tarea');
            this.dataId = false; //no hay registro entonces se hara un post
            this.activeData = true;
            this.data.id = 0;
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('regional/centro-control');
  }
  validateSave() {
    if (
      this.data.tables === 0 ||
      this.data.tables === undefined ||
      this.data.tables === null
    ) {
      this.activeMesas = true;
    } else {
      this.activeMesas = false;
    }
    if (
      this.data.dinners === 0 ||
      this.data.dinners === undefined ||
      this.data.dinners === null
    ) {
      this.activeComensales = true;
    } else {
      this.activeComensales = false;
    }
    if (
      this.data.tables === 0 ||
      this.data.tables === undefined ||
      this.data.dinners === 0 ||
      this.data.dinners === undefined
    ) {
      return;
    } else {
      this.save();
    }
  }
  save() {
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    // si no hay registro en el get sera un post
    if (this.dataId === false) {
      this.addPropina();
    } else {
      this.updatePropina();
    }
  }
  addPropina() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    console.log('Obj To send post => ', this.data);
    this.service
      .serviceGeneralPostWithUrl('PeopleCounting', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.router.navigateByUrl('regional/centro-control');
        }
      });
  }
  updatePropina() {
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('Obj To send put => ', this.data);
    this.service.serviceGeneralPut('PeopleCounting', this.data).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        this.router.navigateByUrl('regional/centro-control');
      }
    });
  }
}
class CountPersonModel {
  id: number;
  branchId: number;
  tables: number;
  dinners: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}

