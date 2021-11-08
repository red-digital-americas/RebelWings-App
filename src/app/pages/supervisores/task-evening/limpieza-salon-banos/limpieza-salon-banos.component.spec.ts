import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LimpiezaSalonBanosComponent } from './limpieza-salon-banos.component';

describe('LimpiezaSalonBanosComponent', () => {
  let component: LimpiezaSalonBanosComponent;
  let fixture: ComponentFixture<LimpiezaSalonBanosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LimpiezaSalonBanosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LimpiezaSalonBanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
