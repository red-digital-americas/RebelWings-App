import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public interval: any;
  public user;
  public dataBranch: any[] = [];
  constructor(public router: Router, public service: ServiceGeneralService) { }

  ionViewWillEnter() {

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    // obtener el nombre de sucursal
    // supervisor
    if (this.user.roleId === 1) {
      setTimeout(() => {
        this.router.navigateByUrl('supervisor');
      }, 4000);
      // regional
    } else if (this.user.roleId === 2) {
      setTimeout(() => {
        this.router.navigateByUrl('regional');
      }, 4000);
    }
  }
}
