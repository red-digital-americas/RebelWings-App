import { PopoverController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}
  logout(){
    console.log('cerrar session');
    localStorage.removeItem('userData');

  }
}
