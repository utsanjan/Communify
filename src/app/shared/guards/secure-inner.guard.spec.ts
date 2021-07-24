import { TestBed, async, inject } from '@angular/core/testing';

import { SecureInnerGuard } from './secure-inner.guard';

describe('SecureInnerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecureInnerGuard]
    });
  });

  it('should ...', inject([SecureInnerGuard], (guard: SecureInnerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
