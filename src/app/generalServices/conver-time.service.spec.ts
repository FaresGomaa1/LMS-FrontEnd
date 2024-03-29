import { TestBed } from '@angular/core/testing';

import { ConverTimeService } from './conver-time.service';

describe('ConverTimeService', () => {
  let service: ConverTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
