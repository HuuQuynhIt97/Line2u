/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebNewsUserService } from './web-news-user.service';

describe('Service: WebNewsUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebNewsUserService]
    });
  });

  it('should ...', inject([WebNewsUserService], (service: WebNewsUserService) => {
    expect(service).toBeTruthy();
  }));
});
