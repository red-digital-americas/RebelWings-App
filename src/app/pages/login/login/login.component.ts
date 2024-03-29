import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from './../../../core/services/login/login.service';
import { DialogGeneralMessageComponent } from '../../dialog-general/dialog-general-message/dialog-general-message.component';
import { LoaderComponent } from '../../dialog-general/loader/loader.component';
import { LoaderGeneralService } from '../../dialog-general/loader-general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public showHeader = false;
  public disabled = false;
  showPassport = false;
  loginForm: any;
  resertForm: any;
  public email: string;
  public password: string;
  public message: any;
  public dataProfile: any;
  public validar = false;
  eyed = false;
  public typeInput = 'password';

  constructor(
    public platform: Platform,
    public router: Router,
    public service: LoginService,
    public modalController: ModalController,
    public loader: LoaderGeneralService,
    public load: LoaderComponent
  ) { }

  ionViewWillEnter() {
    console.log('pass', this.password);

  }

  ngOnInit() {
    if (this.platform.is('android')) {
      this.showHeader = false;
    } else if (this.platform.is('ios')) {
      this.showHeader = true;
    }
  }
  forgotPassword() {
    this.router.navigateByUrl('recuperar-contrasena');
  }
  async generalMessage(message) {
    const modal = await this.modalController.create({
      component: DialogGeneralMessageComponent,
      componentProps: {
        header: 'Acceso denegado',
        body: message,
      },
    });
    return await modal.present();
  }
  public viewPassword(type) {
    if (type === true) {
      this.typeInput = 'text';
      this.eyed = true;
    } else {
      this.typeInput = 'password';
      this.eyed = false;
    }
  }
  login(correo, contrasena) {
    // this.load.presentLoading('Cargando..');
    this.loader.loadingPresent();
    this.disabled = true;
    const loginObj = `?email=${correo}&password=${contrasena}`;
    this.service.login(loginObj).subscribe(
      (resp) => {
        if (resp.success) {
          this.disabled = false;
          this.dataProfile = resp.result;
          // this.load.presentLoading('Iniciando sesion..');
          console.log('data profile', this.dataProfile);
          localStorage.setItem('userData', JSON.stringify(this.dataProfile));
          this.loader.loadingDismiss();
          if (this.dataProfile.roleId !== 3) {
            this.router.navigateByUrl('bienvenido');
          }
          else {
            this.load.presentLoading('Error no tienes permisos para iniciar sessión');

          }
        } else {
          this.loader.loadingDismiss();
          this.load.presentLoading('Error al iniciar sesión..');
          this.generalMessage(resp.message);
          this.disabled = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

// this.router.navigateByUrl('bienvenido');
