import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-barra-mantenimiento',
  templateUrl: './barra-mantenimiento.component.html',
  styleUrls: ['./barra-mantenimiento.component.scss'],
})
export class BarraMantenimientoComponent implements OnInit {

  public today = new Date();
  public user: any;
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
  public data: BarraModel = new BarraModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public disabled = false;
  public activeData = false;
  // ******fotos*********
  public base64 = 'data:image/jpeg;base64';
  public url = 'http://34.237.214.147/back/api_rebel_wings/';

  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent, private camera: Camera, public actionSheetController: ActionSheetController,
    public photoService: PhotoService) { }

  ngOnInit() {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    this.getBranch();

  }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Bar/' + this.branchId)
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
            this.data.electricalConnections = false;
            this.data.mixer = false;
            this.data.refrigerator = false;
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

  // agregar fotos de limpieza de salon
  async addPhotoToGallery(idType: number) {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();
    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoBars.push({
      id: 0,
      barId: this.data.id,
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
            this.data.photoBars.splice(position, 1);
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
              .serviceGeneralDelete(`Bar/${id}/Photo`)
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
  addData() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    console.log('Obj To send  post=> ', this.data);
    this.service
      .serviceGeneralPostWithUrl('Bar/', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/5`);
        }
      });
  }
  updateData() {
    console.log('Obj To send put => ', this.data);
    this.service.serviceGeneralPut('Bar/', this.data).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        this.router.navigateByUrl(`regional/centro-control/${this.branchId}/tarea/5`);
      }
    });
  }
}

class BarraModel {
  id: number;
  branchId: number;
  sink: boolean; //type 1
  commentSink: string;
  mixer: boolean; //type 2
  commentMixer: string;
  refrigerator: boolean; //type 3
  commentRefrigerator: string;
  electricalConnections: boolean; //type 4
  commentElectricalConnections: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoBars: PhotoBarsModel [] = [];
}

class PhotoBarsModel{
  id: number;
  barId: number;
  photo: string;
  photoPath: string;
  type: number;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}


