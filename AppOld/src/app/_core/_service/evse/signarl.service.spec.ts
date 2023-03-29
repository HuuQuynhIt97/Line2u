/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignarlService } from './signarl.service';

describe('Service: Signarl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignarlService]
    });
  });

  it('should ...', inject([SignarlService], (service: SignarlService) => {
    expect(service).toBeTruthy();
  }));
});
