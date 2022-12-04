import { TestBed } from '@angular/core/testing';

import { GhlService } from './ghl.service';

describe('GhlService', () => {
  let service: GhlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
