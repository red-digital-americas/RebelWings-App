import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-encuesta-salon',
  templateUrl: './encuesta-salon.component.html',
  styleUrls: ['./encuesta-salon.component.scss'],
})
export class EncuestaSalonComponent implements OnInit {
  public today = new Date();
  public user: any;
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
  // public data: EncuestaModel = new EncuestaModel();
  data;
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public disabled = false;
  public activeData = false;
  // ******variables de validacion ********
  public activeName = false;
  public activeEmail = false;

  public visibleGuardar = true;

  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public alertController: AlertController,
    public service: ServiceGeneralService,
    public load: LoaderComponent) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    this.data = new EncuestaModel();

  //  this.getData();
  // solo se insertaran encuestas
    console.log('Completar la tarea');
    this.dataId = false; //no hay registro entonces se hara un post
    this.activeData = true;
    this.getBranch(this.user.stateId);

  }
  ngOnInit() { }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('SatisfactionSurvey/' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            console.log('si hay registros del dia');
            this.activeData = true;
            this.data = resp.result;
            console.log('get data', this.data);
          }
          else{
            console.log('Completar la tarea');
            this.dataId = false; //no hay registro entonces se hara un post
            this.activeData = true;
          }
        }
      });
  }
  // get  name sucursal
  getBranch(id) {
    let branchIdNumber = 0;
    branchIdNumber = Number(this.branchId);
    console.log('branchIdNumber', branchIdNumber);
    this.service.serviceGeneralGet(`User/GetSucursalList?idState=${id}`).subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.dataBranch.forEach(element => {
          if (element.idfront === branchIdNumber) {
            this.nameBranch = element.titulo;
            this.nameBranch = this.nameBranch.toUpperCase();
            console.log('nombre', this.nameBranch);
          }
        });
      }
    });
  }
  onRateChange(e){
    console.log('start', e);
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
  }
  validateSave() {
    if (
      this.data.name === '' ||
      this.data.name === undefined ||
      this.data.name === null
    ) {
      this.activeName = true;
    } else {
      this.activeName = false;
    }
    if (
      this.data.email === '' ||
      this.data.email === undefined ||
      this.data.email === null
    ) {
      this.activeEmail = true;
    } else {
      this.activeEmail = false;
    }
    if (
      this.data.name === '' ||
      this.data.name === undefined ||
      this.data.email === '' ||
      this.data.email === undefined
    ) {
      return;
    } 
  }
  save() {
    if(this.data.name === "" || this.data.name === undefined || this.data.name === null || this.data.email === "" || this.data.email === undefined || this.data.email === null){
      this.alertCampos();
      this.validateSave()
    }
    else{
    this.load.presentLoading('Guardando..');
    this.visibleGuardar = false;
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    // if (this.branchId === '0') {
      this.addPropina();
    // } else {
    //   this.updatePropina();
    // }
    }
    
  }
  addPropina() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('SatisfactionSurvey', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', this.data);
          this.data = {};
          this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
        }
      });

  }
  updatePropina() {
    const list: any[] = [];
    list.push(this.data);
    console.log('');
    this.service.serviceGeneralPut('SatisfactionSurvey', this.data).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/2`);
      }
    });
  }
  async alertCampos(){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'IMPORTANTE',
      subHeader: 'CAMPOS',
      message: 'VALIDA QUE TODOS LOS CAMPOS ESTEN CARGADOS CORRECTAMENTE',
      mode: 'ios',
      buttons: ['OK'],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }
}
class EncuestaModel {
  id: number;
  branchId: number;
  name: string;
  email: string;
  questionOne: boolean;
  questionTwo: boolean;
  questionThree: boolean;
  questionFour: boolean;
  questionFive: boolean;
  questionSix: boolean;
  review: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}


