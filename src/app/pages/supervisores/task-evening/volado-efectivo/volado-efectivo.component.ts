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

  constructor(
    public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService
  ) {}

  ionViewWillEnter() {
    console.log('data', this.data);

    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idEfectivo = this.routerActive.snapshot.paramMap.get('id');
    if (this.idEfectivo === '0') {
      console.log('Completar la tarea');
      this.activeData = true;
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }

  ngOnInit() {}
  getData() {
    // this.load.presentLoading('Cargando..');
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
    this.router.navigateByUrl('horario/control-vespertino');
  }
  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    this.fotosEfectivo = this.photoService.photos;
    console.log('fotos propina', this.fotosEfectivo);
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
    if(
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
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosEfectivo = this.photoService.photos;
    console.log('fotos efectivo', this.fotosEfectivo);
    if (this.fotosEfectivo.length !== 0) {
      this.fotosEfectivo.forEach((foto) => {
        this.data.photoCashRegisterShortages.push({
          cashRegisterShortageId: 0,
          photoPath: 'jpeg',
          photo: foto.webviewPath,
          createdBy: this.user.id,
          createdDate: this.today,
          updatedBy: this.user.id,
          updatedDate: this.today,
          filepath: foto.filepath,
        });
      });
    }

    console.log('Obj To send => ', this.data);

    if (this.idEfectivo === '0') {
      this.addEfectivo();
    } else {
      this.updateEfectivo();
    }
  }
  addEfectivo() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('CashRegisterShortage', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('horario/control-vespertino');
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      });
  }
  updateEfectivo() {
    if (this.data.photoCashRegisterShortages.length !== 0) {
      this.data.photoCashRegisterShortages.forEach((element) => {
        element.photoPath = '';
      });
    }
    this.service
      .serviceGeneralPut('CashRegisterShortage', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('horario/control-vespertino');
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
  cashRegisterShortageId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}
