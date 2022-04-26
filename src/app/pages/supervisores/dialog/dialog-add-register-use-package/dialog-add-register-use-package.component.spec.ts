import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogAddRegisterUsePackageComponent } from './dialog-add-register-use-package.component';

describe('DialogAddRegisterUsePackageComponent', () => {
  let component: DialogAddRegisterUsePackageComponent;
  let fixture: ComponentFixture<DialogAddRegisterUsePackageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddRegisterUsePackageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddRegisterUsePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
