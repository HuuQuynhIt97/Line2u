/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LineLoginOrNotifyService } from './lineLoginOrNotify.service';

describe('Service: LineLoginOrNotify', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineLoginOrNotifyService]
    });
  });

  it('should ...', inject([LineLoginOrNotifyService], (service: LineLoginOrNotifyService) => {
    expect(service).toBeTruthy();
  }));
});
