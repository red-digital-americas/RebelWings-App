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
  public idLounge: string;
  public data: SalonDataModel = new SalonDataModel();
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosSalon;

  constructor(
    public router: Router,
    private camera: Camera,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public actionSheetController: ActionSheetController,
    public photoService: PhotoService
  ) {}
  ionViewWillEnter(){
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idLounge = this.routerActive.snapshot.paramMap.get('id');
    if (this.idLounge === '0') {
      console.log('Completar la tarea');
    } else {
      console.log('Actualizar la tarea');
    }
  }

  ngOnInit() {
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-matutino');
  }
  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    this.fotosSalon = this.photoService.photos;
    console.log('fotos salon', this.fotosSalon);
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
    this.fotosSalon = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branch = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosSalon = this.photoService.photos;
    console.log('fotos gas', this.fotosSalon);
    if (this.fotosSalon.length !== 0) {
      this.fotosSalon.forEach((foto) => {
        this.data.photoToSetTables.push({
          toSetTableId: 0,
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

    if (this.idLounge === '0') {
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
  updateSAlon() {}
}

class SalonDataModel {
  branch: number;
  comment: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  photoToSetTables: PhotoTableModel[] = [];
}
class PhotoTableModel {
  toSetTableId: number;
  photoPath: string;
  photo: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}
