import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemperaturasBebidasSalonComponent } from './temperaturas-bebidas-salon.component';

describe('TemperaturasBebidasSalonComponent', () => {
  let component: TemperaturasBebidasSalonComponent;
  let fixture: ComponentFixture<TemperaturasBebidasSalonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturasBebidasSalonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemperaturasBebidasSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
