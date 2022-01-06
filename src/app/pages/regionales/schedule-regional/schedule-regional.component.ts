import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';

@Component({
  selector: 'app-schedule-regional',
  templateUrl: './schedule-regional.component.html',
  styleUrls: ['./schedule-regional.component.scss'],
})
export class ScheduleRegionalComponent implements OnInit {
  public branchId: string;
  public showHeader = false;
  public dataBranch: any[] = [];
  constructor(public platform: Platform, public router: Router, public service: ServiceGeneralService,
    public load: LoaderComponent) { }

  ionViewWillEnter() {
    if (this.platform.is('android')) {
      this.showHeader = false;
    } else if (this.platform.is('ios')) {
      this.showHeader = true;
    }
    this.getBranch();
  }
  ngOnInit() { }
  getBranch() {
    this.service.serviceGeneralGet('StockChicken/Admin/All-Branch').subscribe(resp => {
      if (resp.success) {
        this.dataBranch = resp.result;
        console.log('get branch', this.dataBranch);
      }
    });
  }
  selecSchedule() {
    if (this.branchId !== undefined) {
      this.router.navigate([`/regional/centro-control/${this.branchId}`]);
    }
  }
}
