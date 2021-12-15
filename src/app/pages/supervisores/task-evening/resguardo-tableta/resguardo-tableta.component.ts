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
  selector: 'app-resguardo-tableta',
  templateUrl: './resguardo-tableta.component.html',
  styleUrls: ['./resguardo-tableta.component.scss'],
})
export class ResguardoTabletaComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idTablet: string;
  public data: TabletModel = new TabletModel();
  public base64 = 'data:image/jpeg;base64';
  public disabled = false;
  public fotosTablet;
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
    this.idTablet = this.routerActive.snapshot.paramMap.get('id');
    if (this.idTablet === '0') {
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
      .serviceGeneralGet('TabletSafeKeeping/' + this.idTablet)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get data', this.data);
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-vespertino');
  }
  async addPhotoToGallery() {
    const name = new Date().toISOString();
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    this.fotosTablet = this.photoService.photos;
    console.log('fotos tablet', this.fotosTablet);
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
    this.fotosTablet = [];
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    this.fotosTablet = this.photoService.photos;
    console.log('fotos tablet', this.fotosTablet);
    if (this.fotosTablet.length !== 0) {
      this.fotosTablet.forEach((foto) => {
        this.data.photoTabletSageKeepings.push({
          tabletSafeKeepingId: 0,
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

    if (this.idTablet === '0') {
      this.addTablet();
    } else {
      this.updateTablet();
    }
  }
  addTablet() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    this.service
      .serviceGeneralPostWithUrl('TabletSafeKeeping', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
          this.router.navigateByUrl('supervisor/control-vespertino');
        }
      });
  }
  updateTablet() {
    if (this.data.photoTabletSageKeepings.length !== 0) {
      this.data.photoTabletSageKeepings.forEach((element) => {
        element.photoPath = '';
      });
    }
    this.service
      .serviceGeneralPut('TabletSafeKeeping', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.photoService.deleteAllPhoto(this.data);
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
  tabletSafeKeepingId: number;
  photo: string;
  photoPath: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
  filepath: string; //no es parte del modelo solo es para eliminar todas las fotos filesystem
}

