import { TestBed } from '@angular/core/testing';

import { UserCookiesService } from './user-cookies.service';

describe('UserCookiesService', () => {
  let service: UserCookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
