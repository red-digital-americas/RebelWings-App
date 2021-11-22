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
  selector: 'app-resguardo-propina',
  templateUrl: './resguardo-propina.component.html',
  styleUrls: ['./resguardo-propina.component.scss'],
})
export class ResguardoPropinaComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idPropina: string;
  public data: PropinaModel = new PropinaModel();
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosPropina;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';
  public activeData = false;
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
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idPropina = this.routerActive.snapshot.paramMap.get('id');
    if (this.idPropina === '0') {
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
      .serviceGeneralGet('Tip/' + this.idPropina)
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

    this.fotosPropina = this.photoService.photos;
    console.log('fotos propina', this.fotosPropina);
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
    this.fotosPropina = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosPropina = this.photoService.photos;
    console.log('fotos propina', this.fotosPropina);
    if (this.fotosPropina.length !== 0) {
      this.fotosPropina.forEach((foto) => {
        this.data.photoTips.push({
          tipId: 0,
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

    if (this.idPropina === '0') {
      this.addPropina();
    } else {
      this.updatePropina();
    }
  }
  addPropina() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('Tip', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('horario/control-vespertino');
        }
      });
  }
  updatePropina() {
    if (this.data.photoTips.length !== 0) {
      this.data.photoTips.forEach((element) => {
        element.photoPath = '';
      });
    }
    this.service.serviceGeneralPut('Tip', this.data).subscribe((data) => {
      if (data.success) {
        this.load.presentLoading('Actualizando..');
        console.log('data', data);
        this.photoService.deleteAllPhoto(this.data);
        this.router.navigateByUrl('horario/control-vespertino');
      }
    });
  }
}
class PropinaModel {
  id: number;
  branchId: number;
  amount: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoTips: PhotoPropinaModel[] = [];
}
class PhotoPropinaModel {
  tipId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}
