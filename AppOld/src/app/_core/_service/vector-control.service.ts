import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { VectorControl } from '../_model/vector-control';
@Injectable({
  providedIn: 'root'
})
export class VectorControlService extends CURDService<VectorControl> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"VectorControl", utilitiesService);
  }

}
