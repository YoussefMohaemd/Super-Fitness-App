/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HealthyServiceService } from './healthy-service.service';

describe('Service: HealthyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HealthyServiceService]
    });
  });

  it('should ...', inject([HealthyServiceService], (service: HealthyServiceService) => {
    expect(service).toBeTruthy();
  }));
});
