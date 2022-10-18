import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-cocina-mantenimiento',
  templateUrl: './cocina-mantenimiento.component.html',
  styleUrls: ['./cocina-mantenimiento.component.scss'],
})
export class CocinaMantenimientoComponent implements OnInit {
  public today = new Date();
  public user: any;
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
  public data: CookModel = new CookModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public disabled = false;
  public activeData = false;

  public visibleGuardar = true;

  // ******fotos*********
  public base64 = 'data:image/jpeg;base64';
  public url = 'http://34.237.214.147/back/api_rebel_wings/';

  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public alertController: AlertController,
    public service: ServiceGeneralService,
    public load: LoaderComponent, private camera: Camera, public actionSheetController: ActionSheetController,
    public photoService: PhotoService) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    this.getBranch(this.user.stateId);
    

  }
  ngOnInit() { }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Kitchen/' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            this.activeData = true;
            this.data = resp.result;
            console.log('get data', this.data);
          }
          else {
            this.data.id = 0;
            console.log('completar tarea');
            this.activeData = true;
            this.dataId = false; //no hay registro entonces se hara un post
            this.data.sink = false;
            this.data.correctDistance = false;
            this.data.extractor = false;
            this.data.fryer = false;
            this.data.luminaires = false;
            this.data.mixer = false;
            this.data.doors = false;
            this.data.refrigerator = false;
            this.data.interiorTemperature = false;
            this.data.strainer = false;
            this.data.electricalConnections = false;
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/5`);
  }
  levantamientoTicket() {
    this.router.navigateByUrl('regional/levantamiento-ticket/' + this.branchId);
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
  // agregar fotos de limpieza de salon
  async addPhotoToGallery(idType: number) {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoKitchens.push({
      id: 0,
      kitchenId: this.data.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      type: idType,
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos chicken', this.data);
  }
  // acciones para las fotos de limpieza de salon
  public async showActionSheet(photo, position: number) {
    console.log('photo', photo);
    console.log('posicion', position);

    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
            //
            this.data.photoKitchens.splice(position, 1);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
  //eliminar imagenes bd
  public async deleteImgShowAction(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.service
              .serviceGeneralDelete(`Kitchen/${id}/Photo`)
              .subscribe((data) => {
                if (data.success) {
                  this.load.presentLoading('Eliminando..');
                  console.log('data', data);
                  this.ionViewWillEnter();
                }
              });
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }

  save() {
    if(this.data.commentCorrectDistance === "" || this.data.commentDoors === "" || this.data.commentElectricalConnections === "" || this.data.commentExtractor === ""
      || this.data.commentFryer === "" || this.data.commentInteriorTemperature === "" || this.data.commentLuminaires === "" || this.data.commentMixer === "" ||
      this.data.commentRefrigerator === "" || this.data.commentSink === "" || this.data.commentStrainer === "" || this.data.commentCorrectDistance === undefined || this.data.commentDoors === undefined || this.data.commentElectricalConnections === undefined || this.data.commentExtractor === undefined
      || this.data.commentFryer === undefined || this.data.commentInteriorTemperature === undefined || this.data.commentLuminaires === undefined || this.data.commentMixer === undefined ||
      this.data.commentRefrigerator === undefined || this.data.commentSink === undefined || this.data.commentStrainer === undefined || this.data.photoKitchens.length < 11){
      this.alertCampos();
    }
    else{
    this.visibleGuardar = false;
    this.load.presentLoading('Guardando..');
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('Obj To send => ', this.data);
    // si no hay registro en el get sera un post
    if (this.dataId === false) {
      this.addData();
    } else {
      this.updateData();
    }
   }
  }
  addData() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    const list: any[] = [];
    list.push(this.data);
    console.log('Obj To send  post=> ', list);
    this.service
      .serviceGeneralPostWithUrl('Kitchen', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          if(this.data.sink === false || this.data.mixer === false || this.data.strainer === false || this.data.fryer === false || this.data.extractor === false 
            || this.data.refrigerator === false || this.data.interiorTemperature === false || this.data.doors === false || this.data.correctDistance === false 
            || this.data.electricalConnections === false || this.data.luminaires === false ){
            this.levantamientoTicket();
           }
           else{
            this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/5`);
           }
          
        }
      });
  }
  updateData() {
    const list: any[] = [];
    list.push(this.data);
    console.log('Obj To send put => ', list);
    this.service.serviceGeneralPut('Kitchen', this.data).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        if(this.data.sink === false || this.data.mixer === false || this.data.strainer === false || this.data.fryer === false || this.data.extractor === false 
          || this.data.refrigerator === false || this.data.interiorTemperature === false || this.data.doors === false || this.data.correctDistance === false 
          || this.data.electricalConnections === false || this.data.luminaires === false ){
          this.levantamientoTicket();
         }
         else{
          this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/5`);
         }
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

class CookModel {
  id: number;
  branchId: number;
  sink: boolean; //type 1
  commentSink: string;
  mixer: boolean; //type 2
  commentMixer: string;
  strainer: boolean; //type 3
  commentStrainer: string;
  fryer: boolean; //type 4
  commentFryer: string;
  extractor: boolean; //type 5
  commentExtractor: string;
  refrigerator: boolean; //type 9
  commentRefrigerator: string;
  interiorTemperature: boolean; //type 6
  commentInteriorTemperature: string;
  doors: boolean; //type 7
  commentDoors: string;
  correctDistance: boolean; //type 8
  commentCorrectDistance: string;
  electricalConnections: boolean; //type 10
  commentElectricalConnections: string;
  luminaires: boolean; //type 11
  commentLuminaires: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoKitchens: PhotoKitchensModel[] = [];
}
class PhotoKitchensModel {
  id: number;
  kitchenId: number;
  photo: string;
  photoPath: string;
  type: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}


