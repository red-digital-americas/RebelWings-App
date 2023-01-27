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
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-banos-matutino',
  templateUrl: './banos-matutino.component.html',
  styleUrls: ['./banos-matutino.component.scss'],
})
export class BanosMatutinoComponent implements OnInit {
  public today = new Date();
  public user: any;
  public branchId;
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public data: BanosDataModel = new BanosDataModel();
  public dataBranch: any[] = [];
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosBanos;
  public url = 'http://operamx.mooo.com/back/api_rebel_wings/';
  public activeData = false;
  public createDate = '';
  public visibleGuardar = true;

  public valUsuario = 0;

  constructor(
    public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService,
    public alertController: AlertController,
    public datepipe: DatePipe

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

    this.valUsuario =Number(this.routerActive.snapshot.paramMap.get('us'));
    console.log(this.valUsuario);
    if(this.valUsuario === 1){this.valUsuario = this.user.id}
  }

  ngOnInit() {
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-matutino/tarea/1');
  }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('BanosMatutino/' + this.branchId)
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
    this.data.photoBanosMatutinos.push({
      id: 0,
      banosMatutinoId: this.data.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.valUsuario,
      updatedDate: this.today,
    });
    console.log('fotos Baños', this.data);
    console.log('NUM FOTOS', this.data.photoBanosMatutinos.length);
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
            this.data.photoBanosMatutinos.splice(position, 1);
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
              .serviceGeneralDelete(`BanosMatutino/${id}/Photo`)
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
    this.data.updatedBy = this.valUsuario,
    this.data.updatedDate = this.createDate;
    if (this.branchId === '0') {
      this.addBanos();
    } else {
      this.updateBanos();
    }
  }

  save() {
    
    if(this.data.comment == undefined || this.data.comment == null || this.data.comment == "" || this.data.photoBanosMatutinos.length == 0){
       this.alertCampos();
    }
    else{
      this.load.presentLoading('Guardando..');
      this.visibleGuardar = false;
      this.disabled = true;
      this.fotosBanos = [];
      if (this.data.photoBanosMatutinos.length !== 0) {
        this.data.photoBanosMatutinos.forEach((photo) => {
          if (photo.id !== 0) {
            photo.photoPath = '';
          }
        });
      }
      this.data.branch = this.user.branchId;
      this.formartDate();
      // if (this.branchId === '0') {
      // } else {
      //   this.updateSAlon();
      // }
    }
  }
  addBanos() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.createDate;
    console.log('Obj a guardar =>', this.data);
    this.service
      .serviceGeneralPostWithUrl('BanosMatutino', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('Resp Serv =>', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino/tarea/1');
        }
      });
  }
  updateBanos() {
    console.log('Obj a guardar =>', this.data);
    this.service
      .serviceGeneralPut('BanosMatutino', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('Resp Serv =>', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-matutino/tarea/1');
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      });
  }
}

class BanosDataModel {
  id: number;
  branch: number;
  comment: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  photoBanosMatutinos: PhotoTableModel[] = [];
}
class PhotoTableModel {
  id: number;
  banosMatutinoId: number;
  photoPath: string;
  photo: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
