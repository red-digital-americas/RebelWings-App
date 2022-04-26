import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefrigeradoresCocinaComponent } from './refrigeradores-cocina.component';

describe('RefrigeradoresCocinaComponent', () => {
  let component: RefrigeradoresCocinaComponent;
  let fixture: ComponentFixture<RefrigeradoresCocinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefrigeradoresCocinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefrigeradoresCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
