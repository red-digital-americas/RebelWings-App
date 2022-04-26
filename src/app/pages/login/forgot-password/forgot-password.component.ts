import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/core/services/login/login.service';
import { DialogGeneralMessageComponent } from '../../dialog-general/dialog-general-message/dialog-general-message.component';
import { LoaderComponent } from '../../dialog-general/loader/loader.component';
import { LoaderGeneralService } from '../../dialog-general/loader-general.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public showHeader = false;
  public email: string;

  constructor(
    public platform: Platform,
    public router: Router,
    public service: LoginService,
    public modalController: ModalController,
    public load: LoaderComponent,
    public loader: LoaderGeneralService,

  ) { }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.showHeader = false;
    } else if (this.platform.is('ios')) {
      this.showHeader = true;
    }
  }
  iniciarSesion() {
    this.router.navigateByUrl('login');
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
  forgot(email: string) {
    // this.load.presentLoading('Espere..');
    this.loader.loadingPresent();

    const obj = `?email=${email}`;
    this.service.forgotPassword(obj).subscribe(
      (resp) => {
        if (resp.success) {
          console.log('forgot', resp);
          this.generalMessage(
            'Exito',
            'Recibiras un correo para restablecer tu contraseña'
          );
          this.loader.loadingDismiss();

        } else {
          this.loader.loadingDismiss();
          this.generalMessage('Error', resp.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
