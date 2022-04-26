import { PopoverController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-transfer-request',
  templateUrl: './popover-transfer-request.component.html',
  styleUrls: ['./popover-transfer-request.component.scss'],
})
export class PopoverTransferRequestComponent implements OnInit {
  @Input() data;
  @Input() type: number;
  @Input() idBranch: number;

  public exa = Array(40);

  constructor(
    private popoverCtrl: PopoverController,
    public navParams: NavParams
  ) {}
  ionViewWillEnter() {
    console.log('data que recibe', this.navParams.data);
    this.data = this.navParams.data.data;
    this.type = this.navParams.data.type;
    this.idBranch = this.navParams.data.idBranch;
  }

  ngOnInit() {}
  openTransferencia(valor: number) {
    console.log('valor seleccionado', valor);
    this.popoverCtrl.dismiss({
      id: valor, type: this.type, branch: this.idBranch
    });
  }
}
