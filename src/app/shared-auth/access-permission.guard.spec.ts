import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accessPermissionGuard } from './access-permission.guard';

describe('accessPermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accessPermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
