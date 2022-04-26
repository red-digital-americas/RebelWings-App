import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-remisiones',
  templateUrl: './remisiones.component.html',
  styleUrls: ['./remisiones.component.scss'],
})
export class RemisionesComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: RemisionesModel = new RemisionesModel();
  public idSucursal: string;
  public swiremi = false;


  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController
  ) { }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
  }
  ngOnInit() { }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service.serviceGeneralGet(`Remision/${this.user.branchId
      }`).subscribe(resp => {
        if (resp.success) {
          this.data = resp.result;
          console.log('data remisiones', this.data);
          if(resp.result.length === 0){
            this.swiremi = false;
          }else{
            this.swiremi = true;
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-vespertino');
  }
  // get  name sucursal
}

class RemisionesModel {
  numSerie: string;
  numAlbaran: number;
  fecha: Date;
  remisionesDetails: RemisionesDetailsModel[] = [];
}
class RemisionesDetailsModel {
  referencia: string;
  descripcion: string;
  unidadTotal: number;
  precio: number;
  dto: number;
  total: number;
}
