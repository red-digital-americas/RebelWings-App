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
  public activeData = false;
  public objProduct;
  public search: string;
  public selectCatalogs: any[] = [];
  // nombre de sucursal
  public branchId;
  public nameBranch = '';
  public dataBranch: any[] = [];
  // identificador de nuevo registro
  public newProduct: boolean;

  constructor(
    public router: Router,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);

    // console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idProductoRiesgo = this.routerActive.snapshot.paramMap.get('id');
    console.log('id producto en riesgo ', this.idProductoRiesgo);
    // get nema de sucursal
    this.branchId = this.user.branchId;
    this.getBranch();
    this.getData();
  }

  ngOnInit() { }
  return() {
    // window.history.back();
    this.router.navigateByUrl('supervisor/control-vespertino');
  }
  getCatalog(search) {
    console.log('search', search);
    this.selectCatalogs = [];
    if (search.length > 2) {
      this.service
        .serviceGeneralGet(`Items/${this.user.branchId}/${search}`)
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
      .serviceGeneralGet(`RiskProduct/${this.idProductoRiesgo}/Branch/`)
      .subscribe((resp) => {
        if (resp.success) {
          // si no hay registros en la sucursal
          if (resp.result?.length === 0) {
            this.newProduct = true;
            console.log('Completar la tarea');
            this.objProduct = [
              {
                id: 0,
                branchId: this.user.branchId,
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
            this.activeData = true;

          } else {
            this.newProduct = false;
            this.objProduct = resp.result;
            console.log('get data', this.objProduct);
            console.log('Actualizar la tarea');
            this.activeData = true;
            this.objProduct.forEach(obj => {
              this.getCatalog(obj.product);
            });

          }
        }
      });
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

  addProductRisk() {
    console.log('push');

    this.objProduct.push({
      id: 0,
      branchId: this.user.branchId,
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
    if (this.newProduct === true) {
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
          this.router.navigateByUrl('supervisor/control-vespertino');
        }
      });
  }

  updateProductoRiesgo() {
    this.objProduct.forEach(obj => {
      obj.updatedBy = this.user.id;
      obj.updatedDate = this.today;
    });
    this.service
      .serviceGeneralPut('RiskProduct', this.objProduct)
      .subscribe((data) => {
        if (data.success) {
          this.load.presentLoading('Actualizando..');
          console.log('data', data);
          this.router.navigateByUrl('supervisor/control-vespertino');
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
