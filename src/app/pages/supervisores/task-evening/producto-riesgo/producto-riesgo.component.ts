import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-producto-riesgo',
  templateUrl: './producto-riesgo.component.html',
  styleUrls: ['./producto-riesgo.component.scss'],
})
export class ProductoRiesgoComponent implements OnInit {
  public today = new Date();
  public user: any;
  public idProductoRiesgo: string;
  public data: ProductoRiesgoModel = new ProductoRiesgoModel();
  public disabled = false;
  public objProduct;
  public search: string;
  public selectCatalogs: any[] = [];

  constructor(
    public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);

    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idProductoRiesgo = this.routerActive.snapshot.paramMap.get('id');
    if (this.idProductoRiesgo === '0') {
      console.log('Completar la tarea');
      this.objProduct = [
        {
          id: 0,
          branchId: this.user.branch,
          productId: 0,
          code: '',
          comment: '',
          createdBy: this.user.id,
          createdDate: this.today,
          updatedBy: this.user.id,
          updatedDate: this.today,
          search: '',
        },
      ];
    } else {
      console.log('Actualizar la tarea');
      this.getData();
    }
  }

  ngOnInit() {}
  return() {
    // window.history.back();
    this.router.navigateByUrl('horario/control-vespertino');
  }
  getCatalog(search) {
    console.log('search', search);
    this.selectCatalogs = [];
    if (search.length > 2) {
      this.service
        .serviceGeneralGet(`Items/${this.user.branch}/${search}`)
        .subscribe((resp) => {
          if (resp.success) {
            console.log('get productos', resp);
            this.selectCatalogs = resp.result[2];
          }
        });
    } else {
      this.selectCatalogs = [
        { codarticulo: 0, descripcion: 'No hay información' },
      ];
      return;
    }
  }
  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('RiskProduct/' + this.idProductoRiesgo)
      .subscribe((resp) => {
        if (resp.success) {
          this.objProduct = resp.result;
          console.log('get data', this.objProduct);
          this.getCatalog(this.objProduct.productId);
        }
      });
  }

  addProductRisk() {
    console.log('push');

    this.objProduct.push({
      id: 0,
      branchId: this.user.branch,
      productId: 0,
      code: '',
      comment: '',
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
      search: '',
    });
    console.log('obj data', this.objProduct);
  }

  deleteObjProduct(index) {
    console.log('delete index', index);
    this.objProduct.splice(index, 1);
  }

  save() {
    this.disabled = true;
    // esto se pone aqui por que aun no se estrae la data de un get
    if (this.idProductoRiesgo === '0') {
      this.addProductoRiesgo();
    } else {
      this.updateProductoRiesgo();
    }
  }
  addProductoRiesgo() {
    console.log('insert', this.objProduct);
    this.service
      .serviceGeneralPostWithUrl('RiskProduct', this.objProduct)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading(`Guardando..`);
          console.log('data', data);
          this.router.navigateByUrl('horario/control-vespertino');
        }
      });
  }

  updateProductoRiesgo() {
    this.objProduct.updatedBy = this.user.id;
    this.objProduct.updatedDate = this.today;
    this.service
      .serviceGeneralPut('RiskProduct', this.objProduct)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.router.navigateByUrl('horario/control-vespertino');
        }
      });
  }
}
class ProductoRiesgoModel {
  id: number;
  branchId: number;
  productId: number;
  code: string;
  comment: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  search: string;
}
