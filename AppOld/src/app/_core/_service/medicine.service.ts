import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Medicine } from '../_model/medicine';
@Injectable({
  providedIn: 'root'
})
export class MedicineService extends CURDService<Medicine> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Medicine", utilitiesService);
  }

}
