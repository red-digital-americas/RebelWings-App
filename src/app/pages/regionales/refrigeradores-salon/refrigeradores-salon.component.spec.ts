import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefrigeradoresSalonComponent } from './refrigeradores-salon.component';

describe('RefrigeradoresSalonComponent', () => {
  let component: RefrigeradoresSalonComponent;
  let fixture: ComponentFixture<RefrigeradoresSalonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefrigeradoresSalonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefrigeradoresSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
