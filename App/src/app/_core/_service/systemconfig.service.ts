import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { SystemConfig } from '../_model/systemconfig';
@Injectable({
  providedIn: 'root'
})
export class SystemConfigService extends CURDService<SystemConfig> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SystemConfig", utilitiesService);
  }
  loadDataSystem() {
    return this.http.get(`${this.base}SystemConfig/LoadDataSystem`, {});
  }
  getCheckedData(inOutGuid) {
    return this.http.get<string[]>(`${this.base}SystemConfig/GetCheckedData?inOutGuid=${inOutGuid}`, {});
  }
}
