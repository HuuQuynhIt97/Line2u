/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LinePayService } from './linePay.service';

describe('Service: LinePay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LinePayService]
    });
  });

  it('should ...', inject([LinePayService], (service: LinePayService) => {
    expect(service).toBeTruthy();
  }));
});
