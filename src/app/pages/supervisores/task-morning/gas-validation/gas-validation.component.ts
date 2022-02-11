import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-gas-validation',
  templateUrl: './gas-validation.component.html',
  styleUrls: ['./gas-validation.component.scss'],
})
export class GasValidationComponent implements OnInit {
  public user: any;
  public idGas: string;
  public today = new Date();
  public data: GasDataModel = new GasDataModel();
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';


  public fotosGas;
  public options: CameraOptions = {
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  };
  constructor(
    public routerActive: ActivatedRoute,
    public router: Router,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    private camera: Camera
  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.user);
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idGas = this.routerActive.snapshot.paramMap.get('id');
    if (this.idGas === '0') {
      console.log('Completar la tarea');
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }
  async ngOnInit() { }

  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('ValidationGas/' + this.idGas)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Cargando..');
          this.data = resp.result;
          console.log('get data', this.data);
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-matutino');
  }
  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoValidationGas.push({
      id: 0,
      validationGasId: this.data.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos validacion gas', this.data);
  }


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
            this.data.photoValidationGas.splice(position, 1);
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
              .serviceGeneralDelete(`ValidationGas/${id}/Photo`)
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
    this.disabled = true;
    this.fotosGas = [];
    if (this.data.photoValidationGas.length !== 0) {
      this.data.photoValidationGas.forEach((photo) => {
        if (photo.id !== 0) {
          photo.photoPath = '';
        }
      });
    }
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branch = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosGas = this.photoService.photos;
    console.log('Obj To send => ', this.data);
    if (this.idGas === '0') {
      this.addData();
    } else {
      this.updateData();
    }
  }

  addData() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('ValidationGas', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino');
        }
      });
  }
  updateData() {
    this.service
      .serviceGeneralPut('ValidationGas', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino');
        }
      });
  }
}

class GasDataModel {
  id: number;
  branch: number;
  amount: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoValidationGas: PhotoGasModel[] = [];
}
class PhotoGasModel {
  id: number;
  validationGasId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
