/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CookiesManagerServiceService } from './CookiesManagerService.service';

describe('Service: CookiesManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookiesManagerServiceService]
    });
  });

  it('should ...', inject([CookiesManagerServiceService], (service: CookiesManagerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
