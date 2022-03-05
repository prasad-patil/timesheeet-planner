import { TestBed } from '@angular/core/testing';

import { SubjectTeacherDataService } from './subject-teacher-data.service';

describe('SubjectTeacherDataService', () => {
  let service: SubjectTeacherDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectTeacherDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
