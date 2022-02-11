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
  public data: any[] = [];
  public idSucursal: string;
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];

  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController
  ) {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    // get nema de sucursal
    this.branchId = this.user.branch;
    this.getBranch();
  }
  ngOnInit() {}
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
}
