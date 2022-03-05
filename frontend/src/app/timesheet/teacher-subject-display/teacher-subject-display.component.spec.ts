import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubjectDisplayComponent } from './teacher-subject-display.component';

describe('TeacherSubjectDisplayComponent', () => {
  let component: TeacherSubjectDisplayComponent;
  let fixture: ComponentFixture<TeacherSubjectDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherSubjectDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSubjectDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
