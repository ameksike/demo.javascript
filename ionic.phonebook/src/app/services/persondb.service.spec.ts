import { TestBed } from '@angular/core/testing';

import { PersondbService } from './persondb.service';

describe('PersondbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersondbService = TestBed.get(PersondbService);
    expect(service).toBeTruthy();
  });
});
