import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialogUpdateStockPolloComponent } from './dialog-update-stock-pollo.component';

describe('DialogUpdateStockPolloComponent', () => {
  let component: DialogUpdateStockPolloComponent;
  let fixture: ComponentFixture<DialogUpdateStockPolloComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpdateStockPolloComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogUpdateStockPolloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
