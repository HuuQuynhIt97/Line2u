import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { AbattoirLevel } from '../_model/model';
@Injectable({
  providedIn: 'root'
})
export class AbattoirLevelService extends CURDService<AbattoirLevel> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"AbattoirLevel", utilitiesService);
  }

 
}
