import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Disease } from '../_model/disease';
@Injectable({
  providedIn: 'root'
})
export class DiseaseService extends CURDService<Disease> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Disease", utilitiesService);
  }

}
