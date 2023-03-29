import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Purchase } from '../_model/purchase';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends CURDService<Purchase> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Purchase", utilitiesService);
  }
}
