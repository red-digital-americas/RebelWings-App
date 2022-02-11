import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { DialogAddAlbaranesComponent } from '../../dialog/dialog-add-albaranes/dialog-add-albaranes.component';
@Component({
  selector: 'app-albaranes',
  templateUrl: './albaranes.component.html',
  styleUrls: ['./albaranes.component.scss'],
})
export class AlbaranesComponent implements OnInit {
  public today = new Date();
  public user: any;
  public data: any[] = [];
  public idSucursal: string;
  public disabled = false;
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];
  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService
  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    // get nema de sucursal
    this.branchId = this.user.branch;
    this.getBranch();
  }

  ngOnInit() { }

  getData() {
    this.service
      .serviceGeneralGet(`Albaran/${this.idSucursal}/539314252/539314252`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log(this.data);
        }
      });
    console.log('sin data');
  }
  return() {
    window.history.back();
    // this.router.navigateByUrl('supervisor/control-matutino');
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
  async addAlbaran(dataAlbaran, status: number) {
    console.log('data', dataAlbaran, 'status', status);
    // package = 0 es nuevo registos, si es != 0 es update
    const modal = await this.modalController.create({
      component: DialogAddAlbaranesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        objAlbaran: dataAlbaran,
        idStatus: status,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.ionViewWillEnter();
    });
    this.modalController.dismiss();
    return await modal.present();
  }
}
