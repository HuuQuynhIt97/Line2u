/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebBannerUserService } from './web-banner-user.service';

describe('Service: WebBannerUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebBannerUserService]
    });
  });

  it('should ...', inject([WebBannerUserService], (service: WebBannerUserService) => {
    expect(service).toBeTruthy();
  }));
});
