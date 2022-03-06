import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTimesheetComponent } from './view-all-timesheet.component';

describe('ViewAllTimesheetComponent', () => {
  let component: ViewAllTimesheetComponent;
  let fixture: ComponentFixture<ViewAllTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
