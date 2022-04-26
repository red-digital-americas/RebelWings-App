import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EstadoGeneralBanosComponent } from './estado-general-banos.component';

describe('EstadoGeneralBanosComponent', () => {
  let component: EstadoGeneralBanosComponent;
  let fixture: ComponentFixture<EstadoGeneralBanosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoGeneralBanosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadoGeneralBanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
