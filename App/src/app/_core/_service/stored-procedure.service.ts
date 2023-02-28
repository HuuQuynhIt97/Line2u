import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { StoredProcedure } from '../_model/stored-procedure';
@Injectable({
  providedIn: 'root'
})
export class StoredProcedureService extends CURDService<StoredProcedure> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"StoredProcedure", utilitiesService);
  }
}
