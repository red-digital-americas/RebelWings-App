import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CocinaMantenimientoComponent } from './cocina-mantenimiento.component';

describe('CocinaMantenimientoComponent', () => {
  let component: CocinaMantenimientoComponent;
  let fixture: ComponentFixture<CocinaMantenimientoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CocinaMantenimientoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CocinaMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
