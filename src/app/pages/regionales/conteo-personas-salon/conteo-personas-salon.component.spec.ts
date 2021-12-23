import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConteoPersonasSalonComponent } from './conteo-personas-salon.component';

describe('ConteoPersonasSalonComponent', () => {
  let component: ConteoPersonasSalonComponent;
  let fixture: ComponentFixture<ConteoPersonasSalonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConteoPersonasSalonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConteoPersonasSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
