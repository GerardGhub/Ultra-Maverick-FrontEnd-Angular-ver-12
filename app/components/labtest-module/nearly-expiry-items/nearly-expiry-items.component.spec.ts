import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearlyExpiryItemsComponent } from './nearly-expiry-items.component';

describe('NearlyExpiryItemsComponent', () => {
  let component: NearlyExpiryItemsComponent;
  let fixture: ComponentFixture<NearlyExpiryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearlyExpiryItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NearlyExpiryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
