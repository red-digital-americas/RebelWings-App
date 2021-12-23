import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-audio-video-salon',
  templateUrl: './audio-video-salon.component.html',
  styleUrls: ['./audio-video-salon.component.scss'],
})
export class AudioVideoSalonComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: PrecookedChickenModel = new PrecookedChickenModel();
  public dataId = false; //sirve para identificar si el get trae informacion y diferencia entre el post y put
  public idBranch: string;
  public disabled = false;
  public activeData = false;
  constructor(public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idBranch = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() { }
  // get data audio
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('AudioVideo/' + this.idBranch)
      .subscribe((resp) => {
        if (resp.success) {
          if (resp.result?.length !== 0 && resp.result !== null) {
            this.dataId = true; //si hay registro entonces se hara un put
            this.activeData = true;
            this.data = resp.result;
            console.log('get data', this.data);
          }
          else {
            this.activeData = true;
            console.log('completar tarea');
            this.dataId = false; //no hay registro entonces se hara un post
            this.data.id = 0;
            this.data.tvWorksProperly = false;
            this.data.speakersWorkProperly = false;
            this.data.terraceTvWorksProperly = false;
            this.data.terraceSpeakersWorkProperly = false;
            this.data.commentTvWorksProperly= '';
            this.data.commentSpeakersWorkProperly='';
            this.data.commentTerraceTvWorksProperly='';
            this.data.commentTerraceSpeakersWorkProperly='';

          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('regional/centro-control');
  }
  save() {
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    this.data.branchId = this.user.branch;
    this.data.updatedBy = this.user.id;
    this.data.updatedDate = this.today;
    // si no hay registro en el get sera un post
    if (this.dataId === false) {
      this.addVideo();
    } else {
      this.updateVideo();
    }
  }
  addVideo() {
    this.data.createdBy = this.user.id;
    this.data.createdDate = this.today;
    console.log('Obj To send  post=> ', this.data);
    this.service
      .serviceGeneralPostWithUrl('AudioVideo', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', data);
          this.router.navigateByUrl('regional/centro-control');
        }
      });
  }
  updateVideo() {
    console.log('Obj To send put => ', this.data);
    this.service
      .serviceGeneralPut('AudioVideo', this.data)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.router.navigateByUrl('regional/centro-control');
        }
      });
  }
}
class PrecookedChickenModel {
  id: number;
  branchId: number;
  tvWorksProperly: boolean;
  commentTvWorksProperly: string;
  speakersWorkProperly: boolean;
  commentSpeakersWorkProperly: string;
  terraceTvWorksProperly: boolean;
  commentTerraceTvWorksProperly: string;
  terraceSpeakersWorkProperly: boolean;
  commentTerraceSpeakersWorkProperly: string;
  createdBy: number;
  createdDate: Date;
  updatedBy: number;
  updatedDate: Date;
}

