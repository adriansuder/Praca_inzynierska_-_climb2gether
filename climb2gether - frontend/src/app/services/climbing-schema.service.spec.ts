import { TestBed } from '@angular/core/testing';

import { ClimbingSchemaService } from './climbing-schema.service';

describe('ClimbingSchemaService', () => {
  let service: ClimbingSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimbingSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
