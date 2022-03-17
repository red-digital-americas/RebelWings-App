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
  selector: 'app-volado-efectivo',
  templateUrl: './volado-efectivo.component.html',
  styleUrls: ['./volado-efectivo.component.scss'],
})
export class VoladoEfectivoComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idEfectivo: string;
  public data: EfectivoModel = new EfectivoModel();
  public activeData = false;
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosEfectivo;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';
  // ******variables de validacion ********
  public activeAmount = false;
  public activeComment = false;
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];



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
    console.log('data', this.data);

    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idEfectivo = this.routerActive.snapshot.paramMap.get('id');
    // get name de sucursal
    this.branchId = this.user.branchId;
    this.getBranch();
    if (this.idEfectivo === '0') {
      console.log('Completar la tarea');
      this.activeData = true;
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }

  ngOnInit() { }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('CashRegisterShortage/' + this.idEfectivo)
      .subscribe((resp) => {
        if (resp.success) {
          this.activeData = true;
          this.data = resp.result;
          console.log('get data', this.data);
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-vespertino');
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
  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.data.photoCashRegisterShortages.push({
      id: 0,
      cashRegisterShortageId: this.data.id,
      photo: this.photoService.photos[0].webviewPath,
      photoPath: 'jpeg',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    });
    console.log('fotos ', this.data);
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
            this.data.photoCashRegisterShortages.splice(position, 1);
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
              .serviceGeneralDelete(`CashRegisterShortage/${id}/Photo`)
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
  validateSave() {
    if (
      this.data.amount === 0 ||
      this.data.amount === undefined ||
      this.data.amount === null
    ) {
      this.activeAmount = true;
    } else {
      this.activeAmount = false;
    }
    if (
      this.data.comment === '' ||
      this.data.comment === undefined ||
      this.data.comment === null
    ) {
      this.activeComment = true;
    } else {
      this.activeComment = false;
    }
    if (
      this.data.amount === 0 ||
      this.data.amount === undefined ||
      this.data.comment === '' ||
      this.data.comment === undefined
    ) {
      return;
    } else {
      this.save();
    }
  }
  save() {
    this.disabled = true;
    this.fotosEfectivo = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branchId;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    console.log('Obj To send => ', this.data);

    if (this.idEfectivo === '0') {
      this.addData();
    } else {
      this.updateData();
    }
  }
  addData() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('CashRegisterShortage', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-vespertino');
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      });
  }
  updateData() {
    if (this.data.photoCashRegisterShortages.length !== 0) {
      this.data.photoCashRegisterShortages.forEach((element) => {
        if (element.id !== 0) {
          element.photoPath = '';
        }
      });
    }
    this.service
      .serviceGeneralPut('CashRegisterShortage', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-vespertino');
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      });
  }
}
class EfectivoModel {
  id: number;
  branchId: number;
  amount: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoCashRegisterShortages: PhotoEfectivoModel[] = [];
}
class PhotoEfectivoModel {
  id: number;
  cashRegisterShortageId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}
