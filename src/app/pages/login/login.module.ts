import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeComponent } from './welcome/welcome.component';
@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, WelcomeComponent],
  imports: [CommonModule, IonicModule, LoginRoutingModule, FormsModule],
})
export class LoginModule {}
