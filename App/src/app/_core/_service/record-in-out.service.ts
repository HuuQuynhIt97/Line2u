import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { RecordInOut } from '../_model/record-in-out';
@Injectable({
  providedIn: 'root'
})
export class RecordInOutService extends CURDService<RecordInOut> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordInOut", utilitiesService);
  }
  getCheckedData(inOutGuid) {
    return this.http.get<string[]>(`${this.base}RecordInOut/GetCheckedData?inOutGuid=${inOutGuid}`, {});
  }
}
