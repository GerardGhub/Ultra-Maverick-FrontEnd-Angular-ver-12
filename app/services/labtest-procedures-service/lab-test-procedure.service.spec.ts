import { TestBed } from '@angular/core/testing';

import { LabTestProcedureService } from './lab-test-procedure.service';

describe('LabTestProcedureService', () => {
  let service: LabTestProcedureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabTestProcedureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
