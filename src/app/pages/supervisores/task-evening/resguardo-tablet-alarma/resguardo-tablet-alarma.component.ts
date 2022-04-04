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
  selector: 'app-resguardo-tablet-alarma',
  templateUrl: './resguardo-tablet-alarma.component.html',
  styleUrls: ['./resguardo-tablet-alarma.component.scss'],
})
export class ResguardoTabletAlarmaComponent implements OnInit {

  public today = new Date();
  public user: any;
  public idTablet: string;
  public idAlarma: string;

  public dataTablet: TabletModel = new TabletModel();
  public dataAlarma: AlarmModel = new AlarmModel();

  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosTablet;
  public fotosAlarma;

  public url = 'http://34.237.214.147/back/api_rebel_wings/';
  // toggle para visualizar alarma y tablet
  public toggTable = false;
  public toggAlarma = false;

  constructor(public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.idTablet = this.routerActive.snapshot.paramMap.get('idTablet');
    this.idAlarma = this.routerActive.snapshot.paramMap.get('idAlarma');
    console.log(`idTablet ${this.idTablet} idAlarma ${this.idAlarma}`);
    // get name de sucursal
    if (this.idTablet === '0') {
      console.log('Completar la tarea');
    } else {
      console.log('Actualizar la tarea');
      this.getDataTablet();
    }
    if (this.idAlarma === '0') {
      console.log('Completar la tarea');
    } else {
      console.log('Actualizar la tarea');
      this.getDataAlarma();
    }
  }


  ngOnInit() { }

  getDataTablet() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('TabletSafeKeeping/' + this.idTablet)
      .subscribe((resp) => {
        if (resp.success) {
          this.dataTablet = resp.result;
          console.log('get dataTablet', this.dataTablet);
        }
      });
  }
  getDataAlarma() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Alarm/' + this.idAlarma)
      .subscribe((resp) => {
        if (resp.success) {
          this.dataAlarma = resp.result;
          console.log('get data', this.dataAlarma);
        }
      });
  }
  return() {
    this.router.navigateByUrl('supervisor/control-vespertino');
  }


  async addPhotoToGalleryTablet() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.dataTablet.photoTabletSageKeepings.push({
      id: 0,
      tabletSafeKeepingId: this.dataTablet.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos chicken', this.dataTablet);
  }
  async addPhotoToGalleryAlarma() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.dataAlarma.photoAlarms.push({
      id: 0,
      alarmId: this.dataAlarma.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos ', this.dataAlarma);
  }


  public async showActionSheetTablet(photo, position: number) {
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
            this.dataTablet.photoTabletSageKeepings.splice(position, 1);
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
  public async showActionSheetAlarma(photo, position: number) {
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
            this.dataAlarma.photoAlarms.splice(position, 1);
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
  public async deleteImgShowActionTablet(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.service
              .serviceGeneralDelete(`TabletSafeKeeping/${id}/Photo`)
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
  public async deleteImgShowActionAlarma(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.service
              .serviceGeneralDelete(`Alarm/${id}/Photo`)
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

  saveTablet() {
    this.disabled = true;
    this.fotosTablet = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.dataTablet.branchId = this.user.branchId;
    this.dataTablet.updatedBy = this.user.id;
    this.dataTablet.updatedDate = this.today;
    console.log('Obj To send => ', this.dataTablet);

    if (this.idTablet === '0') {
      this.addTablet();
    } else {
      this.updateTablet();
    }
  }
  saveAlarma() {
    this.disabled = true;
    this.fotosAlarma = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.dataAlarma.branchId = this.user.branchId;
    this.dataAlarma.updatedBy = this.user.id;
    this.dataAlarma.updatedDate = this.today;
    console.log('Obj To send => ', this.dataAlarma);

    if (this.idAlarma === '0') {
      this.addDataAlarma();
    } else {
      this.updateDataAlarma();
    }
  }
  addTablet() {
    this.dataTablet.createdBy = this.user.id;
    this.dataTablet.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('TabletSafeKeeping', this.dataTablet)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.dataTablet);
          this.disabled = false;
          this.router.navigateByUrl('supervisor/control-vespertino');
        }
      });
  }
  updateTablet() {
    if (this.dataTablet.photoTabletSageKeepings.length !== 0) {
      this.dataTablet.photoTabletSageKeepings.forEach((element) => {
        if (element.id !== 0) {
          element.photoPath = '';
        }
      });
    }
    this.service
      .serviceGeneralPut('TabletSafeKeeping', this.dataTablet)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.disabled = false;
          this.photoService.deleteAllPhoto(this.dataTablet);
          this.router.navigateByUrl('supervisor/control-vespertino');
        }
      });
  }
  addDataAlarma() {
    this.dataAlarma.createdBy = this.user.id;
    this.dataAlarma.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('Alarm', this.dataAlarma)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.dataAlarma);
          this.disabled = false;
          this.router.navigateByUrl('supervisor/control-vespertino');
        }
      });
  }
  updateDataAlarma() {
    if (this.dataAlarma.photoAlarms.length !== 0) {
      this.dataAlarma.photoAlarms.forEach((element) => {
        if (element.id !== 0) {
          element.photoPath = '';
        }
      });
    }
    this.service.serviceGeneralPut('Alarm', this.dataAlarma).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        this.photoService.deleteAllPhoto(this.dataAlarma);
        this.disabled = false;
        this.router.navigateByUrl('supervisor/control-vespertino');
      }
    });
  }
}
class TabletModel {
  id: number;
  branchId: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoTabletSageKeepings: PhotoTabletModel[] = [];
}
class PhotoTabletModel {
  id: number;
  tabletSafeKeepingId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
class AlarmModel {
  id: number;
  branchId: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoAlarms: PhotoAlarmModel[] = [];
}
class PhotoAlarmModel {
  id: number;
  alarmId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}

