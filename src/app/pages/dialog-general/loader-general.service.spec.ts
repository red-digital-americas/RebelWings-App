import { TestBed } from '@angular/core/testing';

import { LoaderGeneralService } from './loader-general.service';

describe('LoaderGeneralService', () => {
  let service: LoaderGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
