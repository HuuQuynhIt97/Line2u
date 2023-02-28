import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { RecordAccidentFee } from '../../_model/model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecordAccidentFeeService extends CURDService<RecordAccidentFee> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordAccidentFee", utilitiesService);
  }
  accidentCalculate(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordAccidentFee/AccidentCalculate?guid=${guid}`, {});
  }
 
}
