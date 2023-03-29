/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CalendarsServiceService } from './calendarsService.service';

describe('Service: CalendarsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarsServiceService]
    });
  });

  it('should ...', inject([CalendarsServiceService], (service: CalendarsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
