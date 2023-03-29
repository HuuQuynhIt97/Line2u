import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Disinfection } from '../_model/disinfection';
@Injectable({
  providedIn: 'root'
})
export class DisinfectionService extends CURDService<Disinfection> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Disinfection", utilitiesService);
  }

}
