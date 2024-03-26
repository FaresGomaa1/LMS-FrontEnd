import { TestBed } from '@angular/core/testing';

import { UserLogInService } from './user-log-in.service';

describe('UserLogInService', () => {
  let service: UserLogInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLogInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
