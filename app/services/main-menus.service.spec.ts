import { TestBed } from '@angular/core/testing';

import { MainMenusService } from './main-menus.service';

describe('MainMenusService', () => {
  let service: MainMenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainMenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
