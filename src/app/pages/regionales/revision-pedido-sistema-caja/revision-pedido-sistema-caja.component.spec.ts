import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RevisionPedidoSistemaCajaComponent } from './revision-pedido-sistema-caja.component';

describe('RevisionPedidoSistemaCajaComponent', () => {
  let component: RevisionPedidoSistemaCajaComponent;
  let fixture: ComponentFixture<RevisionPedidoSistemaCajaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionPedidoSistemaCajaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionPedidoSistemaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
