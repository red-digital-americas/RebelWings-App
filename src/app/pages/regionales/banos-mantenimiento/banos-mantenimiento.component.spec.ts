import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BanosMantenimientoComponent } from './banos-mantenimiento.component';

describe('BanosMantenimientoComponent', () => {
  let component: BanosMantenimientoComponent;
  let fixture: ComponentFixture<BanosMantenimientoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BanosMantenimientoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BanosMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
