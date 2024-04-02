import { TestBed } from '@angular/core/testing';

import { QuestionInExamService } from './question-in-exam.service';

describe('QuestionInExamService', () => {
  let service: QuestionInExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionInExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
