import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RevisionMesasSistemaCajaComponent } from './revision-mesas-sistema-caja.component';

describe('RevisionMesasSistemaCajaComponent', () => {
  let component: RevisionMesasSistemaCajaComponent;
  let fixture: ComponentFixture<RevisionMesasSistemaCajaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionMesasSistemaCajaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionMesasSistemaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
