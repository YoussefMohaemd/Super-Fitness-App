/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThemeManagerServiceService } from './ThemeManagerService.service';

describe('Service: ThemeManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeManagerServiceService]
    });
  });

  it('should ...', inject([ThemeManagerServiceService], (service: ThemeManagerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
