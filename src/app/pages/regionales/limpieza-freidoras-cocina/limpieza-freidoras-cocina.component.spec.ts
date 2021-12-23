import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LimpiezaFreidorasCocinaComponent } from './limpieza-freidoras-cocina.component';

describe('LimpiezaFreidorasCocinaComponent', () => {
  let component: LimpiezaFreidorasCocinaComponent;
  let fixture: ComponentFixture<LimpiezaFreidorasCocinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LimpiezaFreidorasCocinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LimpiezaFreidorasCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
