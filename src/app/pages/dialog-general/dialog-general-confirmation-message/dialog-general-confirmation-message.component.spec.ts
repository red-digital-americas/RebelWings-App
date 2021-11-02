import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogGeneralConfirmationMessageComponent } from './dialog-general-confirmation-message.component';

describe('DialogGeneralConfirmationMessageComponent', () => {
  let component: DialogGeneralConfirmationMessageComponent;
  let fixture: ComponentFixture<DialogGeneralConfirmationMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGeneralConfirmationMessageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogGeneralConfirmationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
