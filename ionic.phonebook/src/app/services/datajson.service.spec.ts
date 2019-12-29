import { TestBed } from '@angular/core/testing';

import { DatajsonService } from './datajson.service';

describe('DatajsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatajsonService = TestBed.get(DatajsonService);
    expect(service).toBeTruthy();
  });
});
