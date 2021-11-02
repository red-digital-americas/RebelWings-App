import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  public interval: any;
  public user;

  constructor(public router: Router) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log('user', this.user);
    if (this.user.roleId === 1) {
      setTimeout(() => {
        this.router.navigateByUrl('horario');
      }, 2000);
    } else if (this.user.roleId === 2) {
      setTimeout(() => {
        this.router.navigateByUrl('horario-regional');
      }, 2000);
    }
  }
}
