import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResguardoTabletAlarmaComponent } from './resguardo-tablet-alarma.component';

describe('ResguardoTabletAlarmaComponent', () => {
  let component: ResguardoTabletAlarmaComponent;
  let fixture: ComponentFixture<ResguardoTabletAlarmaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResguardoTabletAlarmaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResguardoTabletAlarmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
