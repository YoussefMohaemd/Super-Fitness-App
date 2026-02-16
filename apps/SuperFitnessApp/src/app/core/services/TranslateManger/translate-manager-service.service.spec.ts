/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateManagerServiceService } from './translate-manager-service.service';

describe('Service: TranslateManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateManagerServiceService]
    });
  });

  it('should ...', inject([TranslateManagerServiceService], (service: TranslateManagerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
