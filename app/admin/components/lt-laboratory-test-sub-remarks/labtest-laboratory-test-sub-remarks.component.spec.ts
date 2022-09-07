import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LABTESTLaboratoryTestSubRemarksComponent } from './labtest-laboratory-test-sub-remarks.component';

describe('LABTESTLaboratoryTestSubRemarksComponent', () => {
  let component: LABTESTLaboratoryTestSubRemarksComponent;
  let fixture: ComponentFixture<LABTESTLaboratoryTestSubRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LABTESTLaboratoryTestSubRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LABTESTLaboratoryTestSubRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
