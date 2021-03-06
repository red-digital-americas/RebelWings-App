import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-focos-salon',
  templateUrl: './focos-salon.component.html',
  styleUrls: ['./focos-salon.component.scss'],
})
export class FocosSalonComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: PrecookedChickenModel = new PrecookedChickenModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
   public disabled = false;
  public activeData = false;
  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    this.getBranch();

  }
  ngOnInit() { }
  // get data foco
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Spotlight/' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            this.activeData = true;
            this.data = resp.result[0];
            console.log('get data', this.data);
          }
          else {
            this.activeData = true;
            console.log('completar tarea');
            this.dataId = false; //no hay registro entonces se hara un post
            this.data.id = 0;
            this.data.brokenSpotlight = true;
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
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
  levantamientoTicket() {
    this.router.navigateByUrl('regional/levantamiento-ticket/' + this.branchId);
  }
  save() {
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    // si no hay registro en el get sera un post
    if (this.dataId === false) {
      this.addSpotlight();
    } else {
      this.updateSpotlight();
    }
  }
  addSpotlight() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    console.log('Obj To send  post=> ', this.data);
    this.service
      .serviceGeneralPostWithUrl('Spotlight', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
        }
      });
  }
  updateSpotlight() {
    console.log('Obj To send put => ', this.data);
    this.service
      .serviceGeneralPut('Spotlight', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
        }
      });
  }
}
class PrecookedChickenModel {
  id: number;
  branchId: number;
  brokenSpotlight: boolean;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}

