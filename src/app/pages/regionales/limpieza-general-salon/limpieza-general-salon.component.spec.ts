import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LimpiezaGeneralSalonComponent } from './limpieza-general-salon.component';

describe('LimpiezaGeneralSalonComponent', () => {
  let component: LimpiezaGeneralSalonComponent;
  let fixture: ComponentFixture<LimpiezaGeneralSalonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LimpiezaGeneralSalonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LimpiezaGeneralSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
