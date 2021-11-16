import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from 'src/app/core/services/services/photo.service';
import { ServiceGeneralService } from 'src/app/core/services/service-general/service-general.service';
import { LoaderComponent } from 'src/app/pages/dialog-general/loader/loader.component';
@Component({
  selector: 'app-wait-tables',
  templateUrl: './wait-tables.component.html',
  styleUrls: ['./wait-tables.component.scss'],
})
export class WaitTablesComponent implements OnInit {
  public user: any;
  public idTable: string;
  public today = new Date();
  public data: any = [];
  constructor(
    public routerActive: ActivatedRoute,
    public router: Router,
    public photoService: PhotoService,
    public service: ServiceGeneralService,
    public load: LoaderComponent
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    console.log(this.routerActive.snapshot.paramMap.get('id'));
    this.idTable = this.routerActive.snapshot.paramMap.get('id');
  }
  return() {
    window.history.back();
    // this.router.navigateByUrl('horario/control-matutino');
  }
  save() {
    console.log('toggle', this.data.waitlistTables);
    const obj = {
      branch: this.idTable,
      waitlistTables: this.data.waitlistTables,
      howManyTables: this.data.howManyTables,
      numberPeople: this.data.numberPeople,
      createdBy: this.user.id,
      createdDate: this.today,
      updatedBy: this.user.id,
      updatedDate: this.today,
    };
    this.service
      .serviceGeneralPostWithUrl('WaitListTable', obj)
      .subscribe((resp) => {
        if (resp.success) {
          this.load.presentLoading('Guardando..');
          console.log('data', resp);
          this.router.navigateByUrl('horario/control-matutino');
        }
      });
  }
}
