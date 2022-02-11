import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-history-ticket',
  templateUrl: './history-ticket.component.html',
  styleUrls: ['./history-ticket.component.scss'],
})
export class HistoryTicketComponent implements OnInit {
  public user: any;
  public data: any[] = [];
  public branchId;
  public dataBranch: any[] = [];
  public nameBranch = '';
  public today = new Date();

  constructor(public router: Router, public routerActive: ActivatedRoute,
    public service: ServiceGeneralService,
    public load: LoaderComponent) { }

  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.branchId = this.routerActive.snapshot.paramMap.get('id');
    this.getData();
    this.getBranch();

  }
  ngOnInit() { }

  getData() {
    this.load.presentLoading('Cargando..');
    this.service
      .serviceGeneralGet('Ticketing?ids=' + this.branchId)
      .subscribe((resp) => {
        if (resp.success) {
          this.data = resp.result;
          console.log('get data', this.data);
          if(this.data.length === 0 ){
            this.data.push({
              regional: 'No hay tickets en esta sucursal'
            });
          }
        }
      });
  }
  return() {
    // window.history.back();
    this.router.navigateByUrl(`regional/centro-control/${this.branchId}`);
  }
  openTicket(id: number){
    this.router.navigateByUrl(`editar-ticket/${this.branchId}/${id}`);
  }
  // get  name sucursal
  getBranch() {
    let branchIdNumber = 0;
    branchIdNumber = Number(this.branchId);
    console.log('branchIdNumber', branchIdNumber);
    this.service.serviceGeneralGet('StockChicken/Admin/All-Branch').subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
        this.dataBranch.forEach(element => {
          if (element.branchId === branchIdNumber) {
            this.nameBranch = element.branchName;
            this.nameBranch = this.nameBranch.toUpperCase();
            console.log('nombre', this.nameBranch);
          }
        });
      }
    });
  }

}
class TicketModel{
  id: number;
  noTicketing: string;
  status: boolean;
  opened: Date;
  closed: null;
}
