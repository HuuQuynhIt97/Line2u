import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PigGenetic } from '../../_model/pigs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PigGeneticService extends CURDService<PigGenetic> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigGenetic", utilitiesService);
  }

}
