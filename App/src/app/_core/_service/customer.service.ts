import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Customer } from '../_model/customer';
@Injectable({
  providedIn: 'root'
})
export class CustomerService extends CURDService<Customer> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Customer", utilitiesService);
  }
  getCustomers(farmGuid) {
    return this.http.get<any>(`${this.base}Customer/GetCustomers?farmGuid=${farmGuid}`, {});
  }
}
