import { ModalController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-dialog-general-message',
  templateUrl: './dialog-general-message.component.html',
  styleUrls: ['./dialog-general-message.component.scss'],
})
export class DialogGeneralMessageComponent implements OnInit {
  @Input() header: string;
  @Input() body: string;
  constructor(
    public modalController: ModalController,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    console.log('data que recibe', this.navParams.data);
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
