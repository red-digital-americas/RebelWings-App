import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-lounge-mounted',
  templateUrl: './lounge-mounted.component.html',
  styleUrls: ['./lounge-mounted.component.scss'],
})
export class LoungeMountedComponent implements OnInit {
  public today = new Date();
  public user: any;
  public branchId;
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public data: SalonDataModel = new SalonDataModel();
  public dataBranch: any[] = [];
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosSalon;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';
  public activeData = false;


  constructor(
    public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService
  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    if (this.branchId === '0') {
      console.log('Completar la tarea');
      this.activeData = true;
    } else {
      console.log('Actualizar la tarea');
      this.getData();

    }
  }

  ngOnInit() {
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-matutino');
  }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('ToSetTable/' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          this.activeData = true;
          this.data = resp.result;
          console.log('get data', this.data);
        }
      });
  }

  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoToSetTables.push({
      id: 0,
      toSetTableId: this.data.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos salon montado', this.data);
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
            this.data.photoToSetTables.splice(position, 1);
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
              .serviceGeneralDelete(`ToSetTable/${id}/Photo`)
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
    this.fotosSalon = [];
    if (this.data.photoToSetTables.length !== 0) {
      this.data.photoToSetTables.forEach((photo) => {
        if (photo.id !== 0) {
          photo.photoPath = '';
        }
      });
    }
    this.data.branch = this.user.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('Obj To send => ', this.data);

    if (this.branchId === '0') {
      this.addSalon();
    } else {
      this.updateSAlon();
    }
  }
  addSalon() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('ToSetTable', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino');
        }
      });
  }
  updateSAlon() {
    this.service
      .serviceGeneralPut('ToSetTable', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino');
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      });
  }
}

class SalonDataModel {
  id: number;
  branch: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoToSetTables: PhotoTableModel[] = [];
}
class PhotoTableModel {
  id: number;
  toSetTableId: number;
  photoPath: string;
  photo: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
