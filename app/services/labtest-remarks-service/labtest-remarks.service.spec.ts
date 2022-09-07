import { TestBed } from '@angular/core/testing';

import { LabtestRemarksService } from './labtest-remarks.service';

describe('LabtestRemarksService', () => {
  let service: LabtestRemarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabtestRemarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
