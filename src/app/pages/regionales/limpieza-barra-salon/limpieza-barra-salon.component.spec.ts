import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LimpiezaBarraSalonComponent } from './limpieza-barra-salon.component';

describe('LimpiezaBarraSalonComponent', () => {
  let component: LimpiezaBarraSalonComponent;
  let fixture: ComponentFixture<LimpiezaBarraSalonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LimpiezaBarraSalonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LimpiezaBarraSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
