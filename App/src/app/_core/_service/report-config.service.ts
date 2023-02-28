import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportConfig } from '../_model/report-config';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { OperationResult } from '../_model/operation.result';
@Injectable({
  providedIn: 'root'
})
export class ReportConfigService extends CURDService<ReportConfig> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"ReportConfig", utilitiesService);
  }
  loadLanguages(lang) {
    const isAdminLang = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_LANGUAGE';
    if (isAdminLang) {
      return of({});
    }
    return this.http.get<any>(`${this.base}ReportConfig/loadLanguages?lang=${lang}`, {});
  }
  getLanguages(lang) {
    const isAdminLang = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_LANGUAGE';
    if (isAdminLang) {
      return of({});
    }
    return this.http.get<any>(`${this.base}ReportConfig/getLanguages?lang=${lang}`, {});
  }
  getReportColumns(menuLink,lang) {
    return this.http.get<any>(`${this.base}ReportConfig/GetReportColumns?menuLink=${menuLink}&lang=${lang}`, {});
  }
  getPages(lang) {
    return this.http.get<any>(`${this.base}ReportConfig/GetPages?lang=${lang}`, {});
  }
  getTypes(lang) {
    return this.http.get<any>(`${this.base}ReportConfig/GetTypes?lang=${lang}`, {});
  }
  updateBySequence(systemMenuGuid, fromSequence, dropSequence): Observable<OperationResult> {
    const query = `systemMenuGuid=${systemMenuGuid}&fromSequence=${+fromSequence + 1}&dropSequence=${+dropSequence + 1}`
    return this.http
      .get<OperationResult>(`${this.base}${this.entity}/UpdateBySequence?${query}`, {});
  }
}
