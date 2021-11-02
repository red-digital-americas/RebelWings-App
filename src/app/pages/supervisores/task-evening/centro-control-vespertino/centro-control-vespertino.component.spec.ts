import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CentroControlVespertinoComponent } from './centro-control-vespertino.component';

describe('CentroControlVespertinoComponent', () => {
  let component: CentroControlVespertinoComponent;
  let fixture: ComponentFixture<CentroControlVespertinoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroControlVespertinoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CentroControlVespertinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
