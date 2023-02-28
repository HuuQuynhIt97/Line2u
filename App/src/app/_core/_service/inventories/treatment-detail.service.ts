import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { TreatmentDetail } from '../../_model/inventories';
@Injectable({
  providedIn: 'root'
})
export class TreatmentDetailService extends CURDService<TreatmentDetail> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"TreatmentDetail", utilitiesService);
  }
 
}
