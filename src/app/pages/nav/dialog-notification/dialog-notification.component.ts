import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogViewTransferComponent } from '../../supervisores/dialog/dialog-view-transfer/dialog-view-transfer.component';
@Component({
  selector: 'app-dialog-notification',
  templateUrl: './dialog-notification.component.html',
  styleUrls: ['./dialog-notification.component.scss'],
})
export class DialogNotificationComponent implements OnInit {
  @Input() id: number;
  public dataNotification: any[] = [];
  public user: any;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('data que recibe', this.navParams.data);
    this.id = this.navParams.data.id;
    this.getNotification();
  }
  ngOnInit() {}
  getNotification(){
    // this.load.loading('Cargando...');
    this.service.serviceGeneralGet('Transfer/Notifications?id='+ this.id).subscribe( resp => {
      if(resp.success){
        this.dataNotification = resp.result;
        console.log('notificaciones', this.dataNotification);
      }
    });
  }
  async openNotification(idTrans: number){
    const modal = await this.modalController.create({
      component: DialogViewTransferComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        id: idTrans,
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
