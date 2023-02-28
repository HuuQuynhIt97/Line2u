import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { TreatmentMaster } from '../../_model/inventories';
@Injectable({
  providedIn: 'root'
})
export class TreatmentMasterService extends CURDService<TreatmentMaster> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"TreatmentMaster", utilitiesService);
  }

}
