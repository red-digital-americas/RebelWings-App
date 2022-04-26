import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResguardoTabletaComponent } from './resguardo-tableta.component';

describe('ResguardoTabletaComponent', () => {
  let component: ResguardoTabletaComponent;
  let fixture: ComponentFixture<ResguardoTabletaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResguardoTabletaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResguardoTabletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
