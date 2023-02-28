import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { TransferFee } from '../_model/model';
@Injectable({
  providedIn: 'root'
})
export class TransferFeeService extends CURDService<TransferFee> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"TransferFee", utilitiesService);
  }

 
}
