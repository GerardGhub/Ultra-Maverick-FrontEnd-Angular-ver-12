import { TestBed } from '@angular/core/testing';

import { LabtestSubRemarksServiceService } from './labtest-sub-remarks-service.service';

describe('LabtestSubRemarksServiceService', () => {
  let service: LabtestSubRemarksServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabtestSubRemarksServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
