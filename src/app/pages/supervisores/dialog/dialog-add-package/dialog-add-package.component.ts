import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogGeneralMessageComponent } from 'src/app/pages/dialog-general/dialog-general-message/dialog-general-message.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-add-package',
  templateUrl: './dialog-add-package.component.html',
  styleUrls: ['./dialog-add-package.component.scss'],
})
export class DialogAddPackageComponent implements OnInit {
  @Input() idSucursal: number;
  @Input() idPackage: number;
  public disabled = false;

  public data: any = [];
  public user: any;
  public today = new Date();
  public createDate = '';


  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent, public datepipe: DatePipe

  ) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('data que recibe', this.navParams.data);
    this.idSucursal = this.navParams.data.idSucursal;
    this.idPackage = this.navParams.data.idPackage;
    if (this.idPackage !== 0) {
      this.getPackage();
    }
  }
  ngOnInit() { }

  getPackage() {
    this.service
      .serviceGeneralGet('StockChicken/' + this.idPackage)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get stock', this.data);
        }
      });
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  formartDate() {
    // 2022-03-11T17:27:00
    console.log('date', this.today);
    let time = '';
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    time =
      '' +
      this.today.getHours() +
      ':' + '00' +
      // this.today.getMinutes() +
      ':' +
      this.today.getSeconds();
    console.log('format', time);
    console.log('date', date);
    this.createDate = `${date}T${time}`;
    console.log('createDate', this.createDate);
    this.addPackage();

    // this.data.time = datetime;
  }
  save() {
    if (this.idPackage === 0) {
      this.formartDate();
    } else {
      this.updatePackage();
    }
  }

  addPackage() {
    const obj = {
      branch: this.user.branchId,
      code: this.data.code,
      amount: this.data.amount,
      statusId: 1, //aun no esta definido
      createdBy: this.user.id,
      createdDate: this.createDate,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    console.log('data enviar', obj);
    this.service
      .serviceGeneralPostWithUrl('StockChicken', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.modalController.dismiss({
            dismissed: true,
          });
        }
      });
  }
  async generalMessage(title, message) {
    const modal = await this.modalController.create({
      component: DialogGeneralMessageComponent,
      cssClass: 'my-custom-popup',
      // cssClass: 'my-custom-class',
      // .setCssClass('profalert');
      componentProps: {
        header: title,
        body: message,
      },
    });
    return await modal.present();
  }
  updatePackage() {
    const obj = {
      id: this.data.id,
      amount: this.data.amount,
      userId: this.user.id,
    };
    this.service
      .serviceGeneralPut('StockChicken/Package-Used', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Actualizando stock..');
          console.log('data', resp);
          this.modalController.dismiss({
            dismissed: true,
          });
        }
        else {
          this.generalMessage('Error', resp.message);
        }
      },
        (error) => {
          this.generalMessage('Error', error.error.message);
          console.log(error);
        });
  }
}
