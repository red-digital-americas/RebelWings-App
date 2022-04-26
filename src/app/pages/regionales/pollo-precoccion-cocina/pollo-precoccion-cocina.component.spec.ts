import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PolloPrecoccionCocinaComponent } from './pollo-precoccion-cocina.component';

describe('PolloPrecoccionCocinaComponent', () => {
  let component: PolloPrecoccionCocinaComponent;
  let fixture: ComponentFixture<PolloPrecoccionCocinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PolloPrecoccionCocinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PolloPrecoccionCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
