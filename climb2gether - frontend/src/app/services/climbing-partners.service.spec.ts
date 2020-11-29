import { TestBed } from '@angular/core/testing';

import { ClimbingPartnersService } from './climbing-partners.service';

describe('ClimbingPartnersService', () => {
  let service: ClimbingPartnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimbingPartnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
