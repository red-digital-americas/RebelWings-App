import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductosCompletosCocinaComponent } from './productos-completos-cocina.component';

describe('ProductosCompletosCocinaComponent', () => {
  let component: ProductosCompletosCocinaComponent;
  let fixture: ComponentFixture<ProductosCompletosCocinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosCompletosCocinaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosCompletosCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
