import { TestBed } from '@angular/core/testing';

import { InstructorCourseService } from './instructor-course.service';

describe('InstructorCourseService', () => {
  let service: InstructorCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
