import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarView, CalendarWeekViewBeforeRenderEvent,
 } from 'angular-calendar';
import { Subject } from 'rxjs';
import { WeekViewHour, WeekViewHourColumn } from 'calendar-utils';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { PhotoService, UserPhoto } from 'src/app/core/services/services/photo.service';
import { LoaderComponent } from '../../dialog-general/loader/loader.component';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, isSameMinute } from 'date-fns';

interface EventGroupMeta {
  type: string;
}

@Component({
  selector: 'app-remisiones-view',
  templateUrl: './remisiones-view.component.html',
  styleUrls: ['./remisiones-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RemisionesViewComponent implements OnInit {
  @ViewChild('picker') picker: any;
  public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
  public dateControlMinMax = new FormControl(new Date());
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';


  public datePedidoReal: any;
  public dateEntregaProg: any;
  public dateEntregaReal: any;

  public turno;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  modalData: {
    action: string;
    event;
  };
  public today = new Date();
  public user: any;
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: any = [];
  activeDayIsOpen = false;
  filteruno = false;
  selectDisabled: boolean = true;
  public idSucursal: string;
  // public swiremi = false;
  // selectedDays: any = [];
  public recurrencia = [];
  public dataGet: any[] = [];
  public eventosChangeMounth = [];
  public groupedSimilarEvents: CalendarEvent[] = [];

  selectedMonthViewDay: CalendarMonthViewDay;
  selectedDayViewDate: Date;
  hourColumns: WeekViewHourColumn[];
  selectedDays: any = [];
  public horaNoDisponibles = [];
  public contadorClick = 0;
  public mostrarBotonAvailable = false;


  public catStatus;
  public catStatusPedido;
  public catStatusEntrega;
  public catStatusFinal;
  public url = 'http://opera.no-ip.net/back/api_rebel_wings/'

  public colors: any = [
    {
      primary: 'rgb(255, 149, 0)',
      secondary: 'rgb(255, 149, 0)',
      id: 2,
    },
    {
      primary: 'rgb(255, 211, 0)',
      secondary: 'rgb(255, 211, 0)',
      id: 6,
    },
    {
      primary: 'rgb(68, 53, 166)',
      secondary: 'rgb(68, 53, 166)',
      id: 4,
    },
    {
      primary: 'rgb(228,213,183)',
      secondary: 'rgb(217,185,155)',
      id: 3,
    },
    {
      primary: 'rgb(26,71,42)',
      secondary: 'rgb(42,98,61)',
      id: 8,
    },
  ];
  public valueModal: any[] = [];

  constructor(
    public router: Router,
    public modalController: ModalController,
    public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent,
    public popoverCtrl: PopoverController,
    private modal: NgbModal,
    public photoService: PhotoService,
  ) { }
  async ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    console.log('colores', this.colors);

    this.turno = this.routerActive.snapshot.paramMap.get('turno');
    console.log('turno select', this.turno);

    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    await this.getData();
    await this.getStatus();
  }
  ngOnInit() {}
  getStatus() {
    let city = this.user.stateId === 1 ? 'DB2' : 'DB1';
    console.log(`State ${this.user.stateId} and DB ${city}`);
    this.service.serviceGeneralGet(`Remision/GetEstatusPedidosEntregas?id_suscursal=${this.user.branch}&dataBase=${city}`).subscribe((data: any) => {
      if (data.success) {
        console.log('resp status', data);
        this.catStatus = data.result;
        this.catStatusPedido = data.result.filter(e=>e.tipo == 'PEDIDO');
        this.catStatusEntrega = data.result.filter(e=>e.tipo == 'ENTREGA');
        console.log(`Estos son  ${this.catStatus}`);
        console.log('Catalogos por tipo', this.catStatusEntrega, this.catStatusPedido);
      }
    });
  }
  getData() {
    this.load.presentLoading('Cargando..');
    let eventos: any;
    this.user = JSON.parse(localStorage.getItem('userData'));

    this.service.serviceGeneralGet(`Remision/GetPedidosEntregas?id_suscursal=${this.user.branch}&dataBase=${this.user.dataBase}`).subscribe((data: any) => {
      if (data.success) {
        console.log('resp calendar', data);
        eventos = data.result;
        eventos.forEach(element => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
          element.sucursalName = this.user.branchName;
        });
        console.log(`Estos son los eventos ${eventos}`);
        this.events = eventos;
        console.log('info', this.events);
        this.eventosChangeMounth = eventos;
      }
    });
    this.colorBtn('month');
  }

  isEditableFechaPedidoReal:boolean =false;
  isEditableFechaEntrega:boolean =false;
  isEditableFechaEntregaReal:boolean =false;
  
  objectEventsPedidos(eventos){
    const newFormat = [];
    if (eventos.length !== 0) {
      
    }
    console.log('new Formats', newFormat);
    this.events.push(newFormat);
    console.log('info', this.events);
    this.eventosChangeMounth.push(eventos);
  }
  filtrarEventos(eventos) {
    //console.log(eventos)
    const dataEventos = eventos.calendar.filter(function (e) {
      if (e.startTime !== null && e.startTime !== 'string' && e.endTime !== null && e.endTime !== 'string') {
        return true;
      }
    });
    const a1 = '0800';
    const a2 = '1200';
    const b3 = '1600';
    const c4 = '2000';

    for (let i = 0; i < dataEventos.length; i++) {
      const str = dataEventos[i].startTime;
      if (str != null) {
        dataEventos[i].inicio = str.replace(':', '');
      }
    }
    for (let i = 0; i < dataEventos.length; i++) {
      const str = dataEventos[i].inicio;
      if (str != null) {
        dataEventos[i].inicio = str.replace(':', '');
      }
    }

    const eventosFinales = [];
    for (let i = 0; i < dataEventos.length; i++) {
      if (Number(dataEventos[i].inicio) >= Number(a1)) {
        eventosFinales.push(dataEventos[i]);
      }
    }
  }

  //COLOR BTN//
  colorBtn(btn: string) {
    document.getElementById('month').className = 'color_button';
    // document.getElementById('week').className = 'color_button';
    // document.getElementById('day').className = 'color_button';
    document.getElementById(btn).className = 'color_button_active';
  }
  //SET ICON//
  public setIcon() {
    setTimeout(() => {
      const elementos = document.getElementsByClassName('cal-event');
      for (let i = 0; i < elementos.length; i++) {
        const element: any = elementos[i];
        if (element.style.backgroundColor === 'rgb(255, 211, 0)') { }

        if (element.style.backgroundColor === 'rgb(68, 53, 166)') { }

        if (element.style.backgroundColor === 'rgb(255, 149, 0)') { }
      }
    }, 10);
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  return() {
    this.router.navigateByUrl(`regional/centro-control/${this.idSucursal}/tarea/6`);
  }

  dayClicked(day: CalendarMonthViewDay, { date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    console.log(events);
  }
  dialogConfirmAvailability() {
    console.log('aqui va un dialogo:');
  }

  selectDay(information) {
    console.log('ENTRA A FUNCION SELECTED DAY:', information);
    console.log('aqui va un dialogo:');

    // const dialogRef = this.dialog.open(CalendarDaysComponent, {
    //   data: information,
    //   width: '70%'
    // });

    // dialogRef.afterClosed().subscribe(async (result) => {
    //   this.selectedDays = [];
    //   await this.ngOnInit();
    // });
  }

  hourSegmentClicked(date: Date) {
    console.log('3');
    this.selectedDayViewDate = date;
    this.addSelectedDayViewClass();
  }
  beforeWeekOrDayViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    console.log('2');
    this.hourColumns = event.hourColumns;
    this.addSelectedDayViewClass();
  }
  private addSelectedDayViewClass() {
    console.log('1');
    this.hourColumns.forEach((column) => {
      column.hours.forEach((hourSegment) => {
        hourSegment.segments.forEach((segment) => {
          delete segment.cssClass;
          if (
            this.selectedDayViewDate &&
            segment.date.getTime() === this.selectedDayViewDate.getTime()
          ) {
            segment.cssClass = 'cal-day-selected';
          }
        });
      });
    });
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  isOutDateButton: boolean = false;
  isDoneButton: boolean = false;
  handleEvent(action: string, event): void {
    let dateNow = new Date();
    let dateProg = new Date(event.fechaProg);
    dateNow.setHours(0,0,0,0);
    dateProg.setHours(0,0,0,0);
    console.log(dateNow, dateProg);
    console.log('action', action);
    console.log('event', event);
    this.catStatusFinal = event.nombre === 'PEDIDO' 
      ? this.catStatusPedido : this.catStatusEntrega;
    this.isOutDateButton = dateProg <= dateNow ? false : true;
    if (event.nombre === 'PEDIDO') {
      event.estatus = dateNow.getTime() === dateProg.getTime() || event.estatus === 2 ? 2 : 3;
    } else {
      event.estatus = dateNow.getTime() === dateProg.getTime() || event.estatus === 2 ? 5 : 6;
    }
    this.isDoneButton = event.estatusName === 'REALIZADO' || event.estatusName === 'FUERA DE TIEMPO'
      ? true : false;
    event.fechaReal = event.fechaReal !== null ? event.fechaReal : new Date();
    this.modalData = { action, event };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  guardarComent(data) {
    console.log('save', data);
    data = {
      id: data.event.id,
      idProveedor: data.event.idProvedor,
      fechaProg: data.event.fechaProg,
      fechaReal: new Date(data.event.fechaReal.toString().split('GMT')[0]+' UTC').toISOString().split('.')[0],
      comentarios: data.event.comment,
      estatus: data.event.estatus,
      idSucursal: data.event.idSucursal,
      tFotosPedidosEntregas: this.photos
    }
    this.service.serviceGeneralPut(`Remision?dataBase=${this.user.dataBase}`, data).subscribe((data: any) => {
      if (data.success) {
        console.log('success', data);
        this.photos = [];
        this.modalData = {
          action: '',
          event: null
        };
        this.ionViewWillEnter();
        this.router.navigate([this.router.url]);
      }
    });


  }

  closePicker() {
    this.picker.cancel();
  }
  photos: any = [];
  async addPhotoToGallery(id: number) {
    await this.photoService.addNewToGallery();
    await this.photoService.loadSaved();

    // agregaremos las fotos pero con id type de acuerdo al caso
    // al agregar las fotos en storage, las pasamos por lista
    console.log('obj fotos', this.photoService);
    this.photos.push({
      id: 0,
      idPedido: id,
      foto: this.photoService.photos[0].webviewPath,
      tipo: 'jpeg',
    });
    console.log('fotos', this.photos);
  }

}

class RemisionesModel {
  numSerie: string;
  numAlbaran: number;
  fecha: Date;
  remisionesDetails: RemisionesDetailsModel[] = [];
}
class RemisionesDetailsModel {
  referencia: string;
  descripcion: string;
  unidadTotal: number;
  precio: number;
  dto: number;
  total: number;
}
