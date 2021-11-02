import { TestBed } from '@angular/core/testing';

import { ServiceGeneralService } from './service-general.service';

describe('ServiceGeneralService', () => {
  let service: ServiceGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
