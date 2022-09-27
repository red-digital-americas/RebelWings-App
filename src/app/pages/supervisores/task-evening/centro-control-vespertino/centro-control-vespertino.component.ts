/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { DialogNotificationComponent } from 'src/app/pages/nav/dialog-notification/dialog-notification.component';
import { LogoutComponent } from 'src/app/pages/popover/logout/logout.component';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-centro-control-vespertino',
  templateUrl: './centro-control-vespertino.component.html',
  styleUrls: ['./centro-control-vespertino.component.scss'],
})
export class CentroControlVespertinoComponent implements OnInit {
  public user: any;
  public vespertino = 2;
  public data: any[] = [];
  public dataNotification: any = [];
  // nombre de sucursal
  public branchId;
  // public nameBranch = '';
  public dataBranch: any[] = [];
  // se juntaron tablet y alarma
  public tabletAlarmaActive = false;
  public completeTablAndAlarm = false;
  public progressTablAndAlarm = 0;
  public colorTablAndAlarm;
  public today;
  public countAlarm = 0;
  public countVoladoEfectivo = 0;
  public valueVolado;
  public time;
  // variable menu seleccionable
  public task;
  public completada;
  public Tableta;
  public Alarma;
  public cant;
  public contador = null;
  public tunoCorre = 0;
  public ValUsuario = 1;

  public Inventario;

  public barProgressTask: number;
  public barProgressTask1: number;
  public color: string;

  constructor(
    public router: Router,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public routerActive: ActivatedRoute,
    public datepipe: DatePipe

  ) { }

  ionViewWillEnter() {
    console.log('viewwillenter');
    //this.user = JSON.parse(localStorage.getItem('userData'));
    //console.log('user', this.user);
    // obtener el nombre de sucursal
    //this.branchId = this.user.branchId;
    //this.task = this.routerActive.snapshot.paramMap.get(`idTarea`);
    // this.getBranch();
    //this.notificationVoladoEfectivo();
    this.getDataControl(this.task);
    // this.notificationAlarm();
    this.getInventario();
    


  }
  ngOnInit() {
    this.today = new Date();
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    this.task = this.routerActive.snapshot.paramMap.get(`idTarea`);
    this.branchId = this.user.branchId;
    //this.getNotification();
    //this.notificationVoladoEfectivo();
    //this.getDataControl(this.task);
    //this.notificationAlarm();
    this.startTimer();


  }
  getDataControl(task) {
    // this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet(`ControlCenter/${this.user.branchId}/${this.vespertino}/${task}/${this.user.id}/Manager`)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result.controlCenters;
          this.barProgressTask = resp.result.progress;
          this.barProgressTask1 = resp.result.progress;
          if (this.barProgressTask === 0){
            this.color = 'danger';
          }
          else if (this.barProgressTask === 100){
            this.color = 'success';
          }
          else{
            this.color = 'warning';
          }
          console.log('control vespertino', resp.result);

          //SE ASIGNA EL VALOR DE LA TAREA DE VOLADO DE EFECTIVO
          this.data.filter(data => data.name === "Volado de efectivo").map(data => {this.completada = data.isComplete;});
          //SE ASIGNA EL VALOR DE LA TAREA RESGUARDO DE TABLETA
          this.data.filter(data => data.name === "RESGUARDO DE TABLETA").map(data => {this.Tableta = data.isComplete;});
          //SE ASIGNA EL VALOR DE LA TAREA ALARMA
          //this.data.filter(data => data.name === "ALARMA").map(data => {this.Alarma = data.isComplete;});

          console.log('control volado', this.completada);
          this.notificationVoladoEfectivo();
        //  if(Number(this.valueVolado.message) < 3000){
        //     this.cant = false;
     
        //     if(this.completada === false){
        //     this.barProgressTask = this.barProgressTask + 14.28571428571429;
        //     }

        //  }
        //  else{
        //     this.cant = true;
     
        //     if(this.completada === true){
        //       this.barProgressTask = this.barProgressTask - 14.28571428571429;
        //       }

        //  }
        

        

        }
        
      });
  }

  showUsuario(){
    if(this.ValUsuario == 1){
      this.ValUsuario = 2;
    }
    else{
      if(this.ValUsuario == 2){
        this.ValUsuario = 3;
      }
      else{
      this.ValUsuario = 1;
      }
    }
  }

  activeTabletAndAlarma() {

    this.tabletAlarmaActive = true;
    if (this.Tableta === false) {
      this.completeTablAndAlarm = false;
      if (this.Tableta === false ) {
        this.progressTablAndAlarm = 0;
        this.colorTablAndAlarm = 'danger';
      }
      else if (this.Tableta === true) {
        this.progressTablAndAlarm = 1;
        this.colorTablAndAlarm = 'warning';
      }
    }
    else {
      this.completeTablAndAlarm = true;
      this.colorTablAndAlarm = 'success';
      this.progressTablAndAlarm = 100;
    }
    
  }
  return() {
    console.log('return');
    this.router.navigateByUrl('supervisor');
    // window.history.back();
  }
  async notificationAlarm() {
    const timeAlarmaIni = '22:00:00';
    const timeAlarmaFin = '23:00:00';
    if (this.countAlarm === 0) {
      const time = `${this.today.getHours()}:${this.today.getMinutes()}:00`;
      // console.log('time', time);
      if (time >= timeAlarmaIni && time <= timeAlarmaFin) {
        this.countAlarm += 1;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alerta',
          message: 'Recuerda activar la Alarma y subir la evidencia correspondiente',
          mode: 'ios', //sirve para tomar el diseño de ios
          buttons: ['OK']
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
        console.log('count alarm', this.countAlarm);
      }
    }
  }
  async notificationVoladoEfectivo() {
    this.valueVolado = [];
    console.log('date', this.today);
    let timeTemp = '';
    const hour = this.today.getHours();
    const minute = this.today.getMinutes();
    let hourString = hour.toString();
    let minuteString = minute.toString();
    const date = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    if (hourString.length < 2) {
      hourString = `0${hourString}`;
    }
    if (minuteString.length < 2) {
      minuteString = `0${minuteString}`;
    }
    timeTemp = `${hourString}:${minuteString}:00`;
    this.time = `${date}T${timeTemp}`;
    console.log('format date', this.time);
    this.service.serviceGeneralGet(`CashRegisterShortage/GetCash?id_sucursal=${this.user.branch}&dataBase=${this.user.dataBase}`).subscribe(resp => {
      if (resp.success) {
        // si entra success el volado es mayor a 3000
        this.valueVolado = resp;
        this.valueVolado.message = Number(this.valueVolado.message);
        this.valueVolado.time = this.time;
        console.log('valor', this.valueVolado);
        localStorage.setItem('valueVolado', JSON.stringify(this.valueVolado));
        this.stopTimer();
        this.alertVolado();
      }
      else {

        // prueba
        // this.valueVolado = resp;
        // this.valueVolado.message = 3000;
        // this.valueVolado.time = this.time;
        // console.log('valor', this.valueVolado);
        // localStorage.setItem('valueVolado', JSON.stringify(this.valueVolado));
        // this.alertVolado();
        // //
        // this.valueVolado = resp;
        // this.valueVolado.time = this.time;
        this.valueVolado = resp;
        this.valueVolado.message = Number(this.valueVolado.message);
        localStorage.setItem('valueVolado', JSON.stringify(this.valueVolado));
        console.log('Aun no hay 3mil pesos', this.valueVolado);

      }

      if(this.valueVolado.message < 3000){
        this.cant = false;
 
        if(this.completada === false){
          this.barProgressTask =0;
        this.barProgressTask = this.barProgressTask1 + 14.28571428571429;
        }

     }
     else{
      if(this.valueVolado.message == undefined){
        this.cant = false;
        if(this.completada === false){
          this.barProgressTask =0;
          this.barProgressTask = this.barProgressTask1 + 14.28571428571429;
          }
       }
       else{
        this.cant = true;
 
        if(this.completada === true){
          this.barProgressTask =0;
          this.barProgressTask = this.barProgressTask1 - 14.28571428571429;
          }
        }
     }
     console.log('cant', this.cant);
     this.activeTabletAndAlarma();
    });
  }

    //FUNCIONES DEL TIMER DE VOLADO DE EFECTIVO
    startTimer() {
      this.stopTimer();
      this.contador = setInterval((n) => { 
        this.notificationVoladoEfectivo();
        console.log('muestra timer'); }, 20000);
    }
    
    stopTimer() {
      
        clearInterval(this.contador);
      
    }

    turnoActual(){
      this.tunoCorre =0;
      this.today = new Date();
      var time = this.today.getHours();
      
        console.log('Hora:', time);
        
         
        if ( time > 6 && time < 17) {
          this.tunoCorre = 1;
          this.alertFinal();
        }
        
  
        if (time > 16 && time <= 23) {
            this.tunoCorre = 2;
            
          }
          if(time >= 0 && time < 3) {
            this.tunoCorre = 2;
            
          }
        if(this.tunoCorre == 0){
          this.alertFinal();
        }
  
    }
  
    async alertFinal(){
      this.stopTimer();
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'IMPORTANTE',
        subHeader: 'TURNO',
        message: 'SE TERMINO EL HORARIO DE CAPTURA DE TAREAS DEL TURNO VESPERTINO. <BR>TU TURNO FINALIZARA',
        mode: 'ios',
        buttons: ['OK'],
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
      
      this.terminarTurno();
  
    }

  async alertVolado(){
    if (this.valueVolado.success === true) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Realiza el volado de efectivo',
        subHeader: `Por $ ${this.valueVolado.message} MXN`,
        message: 'Se activara un cronómetro para identificar en cuánto tiempo se hizo el volado de efectivo.',
        mode: 'ios', //sirve para tomar el diseño de ios
        buttons: ['OK']
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
      //this.startTimer();
    }
  }
  //*****************notification*****************************
  async openNotification() {
  // package = 0 es nuevo registos, si es != 0 es update
  const modal = await this.modalController.create({
    component: DialogNotificationComponent,
    cssClass: 'my-custom-class',
    swipeToClose: true,
    componentProps: {
      id: this.user.branchId, //se envia el id de sucursal
    },
  });
  modal.onDidDismiss().then((data) => {
    console.log(data);
    this.ionViewWillEnter();
  });
  this.modalController.dismiss();
  return await modal.present();
}

  async logout(e: any) {
  const popover = await this.popoverCtrl.create({
    component: LogoutComponent,
    cssClass: 'my-custom-class',
    event: e,
    translucent: true,
    mode: 'ios', //sirve para tomar el diseño de ios
    backdropDismiss: true,
  });
  return await popover.present();

}


showTermina() {
  this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'ADVERTENCIA',
    subHeader: 'TERMINA TURNO',
    message: '¿ESTAS SEGURO DE TERMINAR TURNO?',
    mode: 'ios', 
    buttons: [
      {
        text: 'CANCELAR',
        handler: (data: any) => {
          console.log('TERMINAR TURNO CANCELADO');
        }
      },
      {
        text: 'ACEPTAR',
        handler: (data: any) => {
          console.log('TERMINAR TURNO');
          //this.showValidaTermina();
          this.terminarTurno();
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}

showValidaTermina() {
  this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'IMPORTANTE',
    subHeader: 'TERMINAR TURNO',
    message: 'AL TERMINAR EL TURNO YA NO PODRAS INGRESAR NUEVAMENTE',
    mode: 'ios', 
    buttons: [
      {
        text: 'CANCELAR',
        handler: (data: any) => {
          console.log('TERMINAR TURNO CANCELADO');
        }
      },
      {
        text: 'ACEPTAR',
        handler: (data: any) => {
          console.log('TERMINAR');
          this.terminarTurno();
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}

getInventario() {
  this.load.presentLoading('Cargando..');
  this.service
    .serviceGeneralGet(`StockChicken/GetStock?id_sucursal=${this.user.branch}&dataBase=${this.user.dataBase}`)
    .subscribe((resp) => {
      if (resp.success) {
        this.Inventario = resp.result;
        this.Inventario.forEach(element => {
          element.cantidad = 0;
        });
        console.log("objetos inv: ",this.Inventario.length);
      }
      console.log('s ',resp.success);
    });
  console.log('sin data inventario');
}


validacionAsistencia() {
  this.stopTimer();
  this.router.navigateByUrl('supervisor/validacion-assistencia/2');
}
terminarTurno() {
  this.stopTimer();
  this.router.navigateByUrl('supervisor');
}
remisiones(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/remisiones/2/' + id);
}
getNotification() {
  this.service
    .serviceGeneralGet('Transfer/Notifications?id=' + this.user.branchId)
    .subscribe((resp) => {
      if (resp.success) {
        this.dataNotification = resp.result;
        console.log('notificaciones', this.dataNotification);
      }
    });
}
productoRiesgo(id) {
  console.log('id producto en riesgo', id);
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/producto-riesgo/2/' + id);
}
albaranes(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/albaranes/' + id);
}
transferencias(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/transferencias/2/' + id);
}
voladoEfectivo(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/volado-efectivo/2/' + id);
}
resguardoPropina(id) {
  if(this.data[3].isComplete == false){
    if (id === null) {
      id = 0;
    }
    this.stopTimer();
    this.router.navigateByUrl('supervisor/resguardo-propina/' + id);
  }
}
limpiezaSalonBanos(id) {
  if(this.data[4].isComplete == false){
    if (id === null) {
      id = 0;
    }
    this.stopTimer();
    this.router.navigateByUrl('supervisor/limpieza-salon-banos/' + id);
  }
}
resguardoTableta(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/resguardo-tableta/' + id);
}
alarma(id) {
  if (id === null) {
    id = 0;
  }
  this.stopTimer();
  this.router.navigateByUrl('supervisor/alarma/' + id);
}
tabletAndAlarma(idTablet, idAlarma) {
  if(this.data[5].isComplete == false){
    if (idTablet === null) {
      idTablet = 0;
    }
    if (idAlarma === null) {
      idAlarma = 0;
    }
    this.stopTimer();
    console.log(`id tablet ${idTablet} id tablet ${idAlarma}`);
    this.router.navigateByUrl(`supervisor/resguardo-tableta/${idTablet}/alarma/${idAlarma}`);
  }
}
mesas(id: number) {
  if(this.data[1].isComplete == false){
    if (id === null) {
      id = 0;
    }
    this.stopTimer();
    this.router.navigateByUrl(`supervisor/mesa-espera/2/${id}`);
  }
}
stockPollo(id: number) {
  if(this.Inventario.length != 0){
    if (id === null) {
      id = 0;
    }
    this.stopTimer();
    this.router.navigateByUrl('supervisor/expectativa-venta/' + id);
  }
}

}
