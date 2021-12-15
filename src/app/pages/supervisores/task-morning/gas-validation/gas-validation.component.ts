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
  ) {}
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
  async ngOnInit() {}

  getData() {
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

    this.fotosGas = this.photoService.photos;
    console.log('fotos gas', this.fotosGas);
  }
  public async showActionSheet(photo: UserPhoto, position: number) {
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
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branch = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosGas = this.photoService.photos;
    console.log('fotos gas', this.fotosGas);
    if (this.fotosGas.length !== 0) {
      this.fotosGas.forEach((foto) => {
        this.data.photoValidationGas.push({
          validationGasId: 0,
          photo: foto.webviewPath,
          photoPath: 'jpeg',
          createdBy: this.user.id,
          createdDate: this.today,
          updatedBy: this.user.id,
          updatedDate: this.today,
          filepath: foto.filepath,
        });
      });
    }

    console.log('Obj To send => ', this.data);

    if (this.idGas === '0') {
      this.addGas();
    } else {
      this.updateGas();
    }
  }

  addGas() {
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
  updateGas() {
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
  validationGasId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}
