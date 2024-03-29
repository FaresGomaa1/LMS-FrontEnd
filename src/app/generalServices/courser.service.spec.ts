import { TestBed } from '@angular/core/testing';

import { CourserService } from './courser.service';

describe('CourserService', () => {
  let service: CourserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
