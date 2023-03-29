/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreProfileService } from './store-profile.service';

describe('Service: StoreProfile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreProfileService]
    });
  });

  it('should ...', inject([StoreProfileService], (service: StoreProfileService) => {
    expect(service).toBeTruthy();
  }));
});
