import { DialogNotificationComponent } from './pages/nav/dialog-notification/dialog-notification.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './pages/nav/sidebar/sidebar.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogGeneralMessageComponent } from './pages/dialog-general/dialog-general-message/dialog-general-message.component';
// eslint-disable-next-line max-len
import { DialogGeneralConfirmationMessageComponent } from './pages/dialog-general/dialog-general-confirmation-message/dialog-general-confirmation-message.component';
import { LoaderComponent } from './pages/dialog-general/loader/loader.component';
import { Camera } from '@ionic-native/camera/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { IonicSelectableModule } from 'ionic-selectable';
import { PopoverTransferRequestComponent } from './pages/supervisores/popover/popover-transfer-request/popover-transfer-request.component';



@NgModule({
  declarations: [
    AppComponent,
    DialogGeneralMessageComponent,
    DialogGeneralConfirmationMessageComponent,
    SidebarComponent,
    DialogNotificationComponent,
    PopoverTransferRequestComponent
  ],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    FilterPipeModule,
    IonicSelectableModule,
  ],
  providers: [
    LoaderComponent,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    Dialogs,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
