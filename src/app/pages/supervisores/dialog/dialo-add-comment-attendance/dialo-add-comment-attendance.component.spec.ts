import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DialoAddCommentAttendanceComponent } from './dialo-add-comment-attendance.component';

describe('DialoAddCommentAttendanceComponent', () => {
  let component: DialoAddCommentAttendanceComponent;
  let fixture: ComponentFixture<DialoAddCommentAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialoAddCommentAttendanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DialoAddCommentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
