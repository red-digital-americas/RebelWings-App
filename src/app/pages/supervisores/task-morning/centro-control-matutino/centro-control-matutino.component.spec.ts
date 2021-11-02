import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CentroControlMatutinoComponent } from './centro-control-matutino.component';

describe('CentroControlMatutinoComponent', () => {
  let component: CentroControlMatutinoComponent;
  let fixture: ComponentFixture<CentroControlMatutinoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroControlMatutinoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CentroControlMatutinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
