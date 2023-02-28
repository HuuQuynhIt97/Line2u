import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Vendor } from '../_model/vendor';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendorService extends CURDService<Vendor> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Vendor", utilitiesService);
  }

  getVendors(farmGuid) {
    return this.http.get<any>(`${this.base}Vendor/getVendors?farmGuid=${farmGuid}`, {});
  }
}
