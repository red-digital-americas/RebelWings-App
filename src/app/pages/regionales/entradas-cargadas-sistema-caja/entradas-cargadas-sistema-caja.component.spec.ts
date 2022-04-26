import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntradasCargadasSistemaCajaComponent } from './entradas-cargadas-sistema-caja.component';

describe('EntradasCargadasSistemaCajaComponent', () => {
  let component: EntradasCargadasSistemaCajaComponent;
  let fixture: ComponentFixture<EntradasCargadasSistemaCajaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradasCargadasSistemaCajaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EntradasCargadasSistemaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
