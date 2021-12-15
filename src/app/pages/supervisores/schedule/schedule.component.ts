import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public schedule: string;
  public showHeader = false;
  constructor(public platform: Platform, public router: Router) {}

  ngOnInit() {
    if (this.platform.is('android')) {
      this.showHeader = false;
    } else if (this.platform.is('ios')) {
      this.showHeader = true;
    }
  }

  selecSchedule() {
    if (this.schedule === '1') {
      this.router.navigate(['/supervisor/control-matutino']);
      // this.router.navigateByUrl('supervisor/control-matutino');
    } else if (this.schedule === '2') {
      this.router.navigate(['/supervisor/control-vespertino']);
      // this.router.navigateByUrl('supervisor/control-vespertino');
    }
  }
}

