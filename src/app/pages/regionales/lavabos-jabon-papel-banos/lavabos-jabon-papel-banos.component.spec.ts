import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LavabosJabonPapelBanosComponent } from './lavabos-jabon-papel-banos.component';

describe('LavabosJabonPapelBanosComponent', () => {
  let component: LavabosJabonPapelBanosComponent;
  let fixture: ComponentFixture<LavabosJabonPapelBanosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LavabosJabonPapelBanosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LavabosJabonPapelBanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
