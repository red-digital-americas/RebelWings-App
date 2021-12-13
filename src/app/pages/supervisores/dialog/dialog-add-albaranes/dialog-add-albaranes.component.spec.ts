import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogAddAlbaranesComponent } from './dialog-add-albaranes.component';

describe('DialogAddAlbaranesComponent', () => {
  let component: DialogAddAlbaranesComponent;
  let fixture: ComponentFixture<DialogAddAlbaranesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddAlbaranesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddAlbaranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
