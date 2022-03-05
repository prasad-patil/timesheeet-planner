import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTimesheetComponent } from './generate-timesheet.component';

describe('GenerateTimesheetComponent', () => {
  let component: GenerateTimesheetComponent;
  let fixture: ComponentFixture<GenerateTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTimesheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
