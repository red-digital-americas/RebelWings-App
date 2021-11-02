import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading: any;
  constructor(public loadingCrtl: LoadingController) {}

  ngOnInit() {}
  async presentLoading(message: string) {
    this.loading = await this.loadingCrtl.create({
      cssClass: 'my-custom-class',
      message,
      duration: 1000,
    });
    return this.loading.present();
  }

  presentDismiss() {
    return this.loading.dismiss();
  }
}
