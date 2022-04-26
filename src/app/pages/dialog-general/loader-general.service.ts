import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderGeneralService {

  isLoading = false;
  constructor(
    public loadingController: LoadingController
  ) { }

  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Cargando ...',
      spinner: 'circles',
      cssClass: 'ion-loading'
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {
      console.log('loading dismissed');
      this.loadingController.dismiss();
    });
  }
}
