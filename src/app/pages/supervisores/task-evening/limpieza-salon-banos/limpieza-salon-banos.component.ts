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
  selector: 'app-limpieza-salon-banos',
  templateUrl: './limpieza-salon-banos.component.html',
  styleUrls: ['./limpieza-salon-banos.component.scss'],
})
export class LimpiezaSalonBanosComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idLimpieza: string;
  public data: LimpiezaModel = new LimpiezaModel();
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosLimpieza;
  public url = 'http://34.237.214.147/back/api_rebel_wings/';
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
    this.idLimpieza = this.routerActive.snapshot.paramMap.get('id');
    if (this.idLimpieza === '0') {
      console.log('Completar la tarea');
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }
  ngOnInit() {}
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('LivingRoomBathroomCleaning/' + this.idLimpieza)
      .subscribe((resp) => {
        if (resp.success) {
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

    this.fotosLimpieza = this.photoService.photos;
    console.log('fotos salon', this.fotosLimpieza);
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
    this.fotosLimpieza = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosLimpieza = this.photoService.photos;
    console.log('fotos gas', this.fotosLimpieza);
    if (this.fotosLimpieza.length !== 0) {
      this.fotosLimpieza.forEach((foto) => {
        this.data.photoLivingRoomBathroomCleanings.push({
          livingRoomBathroomCleaningId: 0,
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

    if (this.idLimpieza === '0') {
      this.addLimpieza();
    } else {
      this.updateLimpieza();
    }
  }
  addLimpieza() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('LivingRoomBathroomCleaning', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('horario/control-vespertino');
        }
      });
  }
  updateLimpieza() {
    if (this.data.photoLivingRoomBathroomCleanings.length !== 0) {
      this.data.photoLivingRoomBathroomCleanings.forEach((element) => {
        element.photoPath = '';
      });
    }
    this.service
      .serviceGeneralPut('LivingRoomBathroomCleaning', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('horario/control-vespertino');
        }
      });
  }
}
class LimpiezaModel {
  id: number;
  branchId: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoLivingRoomBathroomCleanings: PhotoLimpiezaModel[] = [];
}
class PhotoLimpiezaModel {
  livingRoomBathroomCleaningId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}
