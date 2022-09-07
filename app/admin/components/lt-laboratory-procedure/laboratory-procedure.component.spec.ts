import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryProcedureComponent } from './laboratory-procedure.component';

describe('LaboratoryProcedureComponent', () => {
  let component: LaboratoryProcedureComponent;
  let fixture: ComponentFixture<LaboratoryProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaboratoryProcedureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoryProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
