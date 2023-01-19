/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, isSameMinute } from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarView, CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { WeekViewHour, WeekViewHourColumn } from 'calendar-utils';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import {
  UserPhoto,
  PhotoService,
} from 'src/app/core/services/services/photo.service';
import { environment } from 'src/environments/environment';
// import { ExportAsConfig } from 'ngx-export-as';




interface EventGroupMeta {
  type: string;
}
@Component({
  selector: 'app-remisiones',
  templateUrl: './remisiones.component.html',
  styleUrls: ['./remisiones.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RemisionesComponent implements OnInit {
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
  // view: CalendarView = CalendarView.Month;
  // calendarView = CalendarView;

  // viewDate: Date = new Date();

  public today = new Date();
  public user: any;
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: any;
  activeDayIsOpen = false;
  filteruno = false;
  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementIdOrContent: 'export',
  //   options: { // html-docx-js document options
  //     jsPDF: {
  //       orientation: 'landscape'
  //     },
  //   }
  // }
  // public data: RemisionesModel = new RemisionesModel();
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
      primary: '(228,213,183)',
      secondary: '(217,185,155)',
      id: 3,
    },
    {
      primary: '(26,71,42)',
      secondary: '(42,98,61)',
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
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    console.log('colores', this.colors);

    this.turno = this.routerActive.snapshot.paramMap.get('turno');
    console.log('turno select', this.turno);

    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idSucursal = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    this.getStatus();
  }
  ngOnInit() { }
  getStatus() {
    let city = this.user.stateId === 1 ? 'DB2' : 'DB1';
    console.log(`State ${this.user.stateId} and DB ${city}`);
    this.service.serviceGeneralGet(`Remision/GetEstatusPedidosEntregas?id_suscursal=${this.user.branch}&dataBase=${city}`).subscribe((data: any) => {
      if (data.success) {
        console.log('resp status', data);
        this.catStatus = data.result;
        this.catStatusPedido = data.result.filter(e=>e.tipo == 'Pedido');
        this.catStatusEntrega = data.result.filter(e=>e.tipo == 'Entrega');
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
        console.log(`Estos son los eventos ${eventos}`);
        this.objectEvents(eventos);
      }
    });
    this.colorBtn('month');
  }

  //OBJET//
  objectEvents(eventos) {
    // entrega
    const newFormat = [];
    if (eventos.length !== 0) {
      eventos.forEach(e => {
        console.log(`Evento:`, e);
        console.log(this.colors);
        this.colors.forEach(c => {
          console.log(c);
          if (e.estatusEntrega === c.id) {
            newFormat.push({
              id: e.id,
              start: e.fechaEntregaReal !== null ? new Date(e.fechaEntregaReal) : new Date(e.fechaProgEntrega),
              end: e.fechaEntregaReal !== null ? new Date(e.fechaEntregaReal) : new Date(e.fechaProgEntrega),
              title: e.proveedorName,
              color: c,
              statusName: e.estatusEntregaName,
              estatusPedido: e.estatusPedido,
              estatusPedidoName: e.estatusPedidoName,
              estatusEntregaName: e.estatusEntregaName,
              estatusEntrega: e.estatusEntrega,
              draggable: false,
              commentPedido: e.comentariosPedido,
              coment: e.comentariosEntrega,
              estatusId: e.estatusEntrega,
              fechaEntrega: e.fechaProgEntrega,
              fechaEntregaReal: e.fechaEntregaReal,
              fechaPedido: e.fechaProgPedido,
              fechaPedidoReal: e.fechaPedidoReal,
              sucursalName: this.user.branchName,
              idSucursal: e.idSucursal,
              idProvedor: e.idProveedor,
              nombre: 'Entrega',
              fotosPedidosEntregas: e.tFotosPedidosEntregas
            });
          }
          else if (e.statusPedido === c.id) {
            newFormat.push({
              id: e.id,
              start: e.fechaPedidoReal !== null ? new Date(e.fechaPedidoReal) : new Date(e.fechaProgPedido),
              end: e.fechaPedidoReal !== null ? new Date(e.fechaPedidoReal) : new Date(e.fechaProgPedido),
              title: e.proveedorName,
              color: c,
              statusName: e.estatusPedidoName,
              estatusPedido: e.estatusPedido,
              estatusPedidoName: e.estatusPedidoName,
              estatusEntregaName: e.estatusEntregaName,
              estatusEntrega: e.estatusEntrega,
              draggable: false,
              commentPedido: e.comentariosPedido,
              coment: e.comentariosPedido,
              estatusId: e.estatusPedido,
              fechaEntrega: e.fechaProgEntrega,
              fechaEntregaReal: e.fechaEntregaReal,
              fechaPedido: e.fechaProgPedido,
              fechaPedidoReal: e.fechaPedidoReal,
              sucursalName: this.user.branchName,
              idSucursal: e.idSucursal,
              idProvedor: e.idProveedor,
              nombre: 'Pedidido',
              fotosPedidosEntregas: e.tFotosPedidosEntregas
            });
          }
        });
      });
    }
    console.log('new Formats', newFormat);
    this.events = newFormat;
    //     this.dataGet = newFormat;
    console.log('info', this.events);


    this.eventosChangeMounth = eventos;
    // this.filtrarEventos(eventos);
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

    //console.log("Eventos filtrados: ", eventosFinales);
    // this.dataCalendario(eventosFinales);
  }
  // dataCalendario(eventos) {
  //   this.events = [];
  //   for (let i = 0; i < eventos.length; i++) {
  //     const str = eventos[i].startTime;
  //     if (str != null) {
  //       eventos[i].inicio = str.replace(':', '');
  //     }
  //   }
  //   for (let i = 0; i < eventos.length; i++) {
  //     const str = eventos[i].inicio;
  //     if (str != null) {
  //       eventos[i].inicio = str.replace(':', '');
  //     }
  //   }
  //   for (let i = 0; i < eventos.length; i++) {
  //     const horaInicio = eventos[i].startTime.split(':');
  //     const horaFinal = eventos[i].endTime.split(':');
  //     const inicio = new Date(eventos[i].date);
  //     inicio.setHours(Number(horaInicio[0]), Number(horaInicio[1]));
  //     const final = new Date(eventos[i].date);
  //     final.setHours(Number(horaFinal[0]), Number(horaFinal[1]));
  //     const dataEventoPrueba = {
  //       horaInicio: horaInicio[0],
  //       horaFinal: horaFinal[0],
  //       start: inicio,
  //       end: final,
  //       title: '',
  //       color: null,
  //       sr: '',
  //       date: eventos[i].date,
  //       id: eventos[i].id,
  //       timeStart: eventos[i].startTime,
  //       timeEnd: eventos[i].endTime,
  //       meta: {
  //         type: ''
  //       },
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //       draggable: true,
  //     }
  //     const a1 = '0800';
  //     const a2 = '1200';
  //     const b = '1600';
  //     const c = '2000';
  //     if (Number(eventos[i].inicio) >= Number(a1) && Number(eventos[i].inicio) <= Number(a2)) {
  //       dataEventoPrueba.color = colors.uno;
  //       dataEventoPrueba.meta.type = 'uno';
  //     }
  //     if (Number(eventos[i].inicio) >= Number(a2) && Number(eventos[i].inicio) <= Number(b)) {
  //       dataEventoPrueba.color = colors.dos;
  //       dataEventoPrueba.meta.type = 'dos';
  //     }
  //     if (Number(eventos[i].inicio) >= Number(b) && Number(eventos[i].inicio) <= Number(c)) {
  //       dataEventoPrueba.color = colors.tres;
  //       dataEventoPrueba.meta.type = 'tres';
  //     }


  //     if (eventos[i].services.length > 0) {
  //       dataEventoPrueba.sr = eventos[i].serviceRecordId;
  //       dataEventoPrueba.title = 'SR: ' + eventos[i].serviceRecordId + ' /Supplier: ' + eventos[i].suppliername + ' Assignee: ' + eventos[i].assignee + ' / Partner: ' + eventos[i].name + ' / Client: ' + eventos[i].client + ' / City: ' + eventos[i].city + ' / ' + eventos[i].services[0].category + ' / ' + eventos[i].services[0].serviceNumber;
  //       this.events.push(dataEventoPrueba);
  //     }
  //   };

  //   console.log(this.events);


  //   for (let i = 0; i < this.dataGet.length; i++) {
  //     const element = this.dataGet[i];
  //     this.events.push(element);
  //   }
  //   for (let i = 0; i < this.events.length; i++) {
  //     if (this.events[i].title && this.events[i].title === 'Available') {
  //       this.events[i].color = colors.green;
  //     }
  //     if (this.events[i].title && this.events[i].title === 'No Available') {
  //       this.events[i].color = colors.red;
  //     }
  //   }
  //   this.groupedSimilarEvents = [];
  //   const processedEvents = new Set();
  //   const a1 = '08';
  //   const a2 = '12';
  //   const a3 = '16';
  //   const a4 = '20';
  //   this.events.forEach((event) => {
  //     if (processedEvents.has(event)) {
  //       return;
  //     }
  //     const similarEvents = this.events.filter((otherEvent) => {
  //       if (otherEvent !== event &&
  //         !processedEvents.has(otherEvent) &&
  //         isSameMinute(otherEvent.start, event.start) &&
  //         (isSameMinute(otherEvent.end, event.end) ||
  //           (!otherEvent.end && !event.end)) &&
  //         otherEvent.date === event.date && otherEvent.sr === event.sr &&
  //         otherEvent.color.primary === event.color.primary &&
  //         otherEvent.color.sr === event.sr) {

  //         console.log('ENTRA A PRIMER IF MAÑANA');
  //         console.log(event.sr, otherEvent.sr);
  //         return true;
  //       }
  //       if (otherEvent.rrule === event.rrule && otherEvent.rrule !== undefined && event.rrule !== undefined && !processedEvents.has(otherEvent) && event.date === otherEvent.date) {
  //         console.log('ENTRA A SEGUNDO IF AVAILABLE');
  //         return true;
  //       }

  //     });

  //     processedEvents.add(event);
  //     similarEvents.forEach((otherEvent) => {
  //       processedEvents.add(otherEvent);
  //     });
  //     if (similarEvents.length > 0) {
  //       this.groupedSimilarEvents.push({
  //         title: `${similarEvents.length + 1} events`,
  //         color: event.color,
  //         start: event.start,
  //         end: event.end,
  //         meta: {
  //           groupedEvents: [event, ...similarEvents],
  //         },
  //       });
  //     } else {
  //       this.groupedSimilarEvents.push(event);
  //     }
  //   });
  //   //******************************************************************//


  //   console.log(this.groupedSimilarEvents);
  //   console.log(this.events);

  //   this.setIcon();

  // }


  //COLOR BTN//
  colorBtn(btn: string) {
    document.getElementById('month').className = 'color_button';
    document.getElementById('week').className = 'color_button';
    document.getElementById('day').className = 'color_button';
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
    // window.history.back();
    if (this.turno === '1') {
      this.router.navigateByUrl('supervisor/control-matutino/tarea/2');
    }
    else {
      this.router.navigateByUrl('supervisor/control-vespertino');
    }
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
    //ABRE MODAL PARA AGREGAR HORAS//
    // const dialogRef = this.dialog.open(ConfirmationCalendarComponent, {
    //   data: {
    //     header: 'Availability Calendar',
    //     body: 'Do you want to modify the availability in the calendar?'
    //   },
    //   width: '350px'
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     const information = {
    //       id: 0,
    //       day: [],
    //       daysSelected: this.selectedDays,
    //       horaNoDisponible: this.horaNoDisponibles,
    //       operacion: 'inserccion'
    //     }
    //     this.selectedDays.forEach((e: any) => {
    //       if (e.date.getDay() === 0) {
    //         information.day.push(7);
    //       }
    //       if (e.date.getDay() === 1) {
    //         information.day.push(1);
    //       }
    //       if (e.date.getDay() === 2) {
    //         information.day.push(2);
    //       }
    //       if (e.date.getDay() === 3) {
    //         information.day.push(3);
    //       }
    //       if (e.date.getDay() === 4) {
    //         information.day.push(4);
    //       }
    //       if (e.date.getDay() === 5) {
    //         information.day.push(5);
    //       }
    //       if (e.date.getDay() === 6) {
    //         information.day.push(6);
    //       }
    //     });

    //     this.selectDay(information);
    //   }
    // })
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
  handleEvent(action: string, event): void {
    console.log('action', action);
    console.log('event', event);
    // this.valueModal = event;
    this.modalData = { action, event };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  guardarComent(data) {
    console.log('save', data);
    data = {
      id: data.event.id,
      idProveedor: data.event.idProvedor,
      fechaProgPedido: data.event.fechaEntrega,
      fechaPedidoReal: data.event.fechaPedidoReal,
      fechaProgEntrega: data.event.fechaEntrega,
      fechaEntregaReal: data.event.fechaEntregaReal,
      comentariosPedido: data.event.commentPedido,
      comentariosEntrega: data.event.coment,
      estatusEntrega: data.event.estatusEntrega,
      estatusPedido: data.event.estatusId,
      idSucursal: data.event.idSucursal,
      tFotosPedidosEntregas: this.photos
    }
    this.service.serviceGeneralPut(`Remision?dataBase=${this.user.dataBase}`, data).subscribe((data: any) => {
      if (data.success) {
        console.log('success', data);
        this.photos = [];
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
