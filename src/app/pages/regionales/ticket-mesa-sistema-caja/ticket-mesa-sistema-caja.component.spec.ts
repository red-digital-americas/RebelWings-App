import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketMesaSistemaCajaComponent } from './ticket-mesa-sistema-caja.component';

describe('TicketMesaSistemaCajaComponent', () => {
  let component: TicketMesaSistemaCajaComponent;
  let fixture: ComponentFixture<TicketMesaSistemaCajaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMesaSistemaCajaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketMesaSistemaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
