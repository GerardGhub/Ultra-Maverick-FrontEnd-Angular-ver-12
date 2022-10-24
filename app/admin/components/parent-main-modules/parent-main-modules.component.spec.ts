import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMainModulesComponent } from './parent-main-modules.component';

describe('ParentMainModulesComponent', () => {
  let component: ParentMainModulesComponent;
  let fixture: ComponentFixture<ParentMainModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMainModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMainModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
