import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogGeneralMessageComponent } from 'src/app/pages/dialog-general/dialog-general-message/dialog-general-message.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dialog-update-stock-pollo',
  templateUrl: './dialog-update-stock-pollo.component.html',
  styleUrls: ['./dialog-update-stock-pollo.component.scss'],
})
export class DialogUpdateStockPolloComponent implements OnInit {
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
  ngOnInit() { }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

}
