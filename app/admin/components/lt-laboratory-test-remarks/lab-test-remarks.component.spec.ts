import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestRemarksComponent } from './lab-test-remarks.component';

describe('LabTestRemarksComponent', () => {
  let component: LabTestRemarksComponent;
  let fixture: ComponentFixture<LabTestRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabTestRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
