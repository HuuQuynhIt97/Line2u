import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PigTesting } from '../../_model/pigs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PigTestingService extends CURDService<PigTesting> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigTesting", utilitiesService);
  }

}
