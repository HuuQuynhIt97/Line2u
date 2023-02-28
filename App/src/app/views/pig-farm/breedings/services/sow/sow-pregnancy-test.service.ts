import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowPregnancyTest } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowPregnancyTestService extends CURDService<SowPregnancyTest> {
  private recordSource = new BehaviorSubject({} );
  currentSowPregnancyTest = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowPregnancyTest", utilitiesService);
  }
  changeSowPregnancyTest(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowPregnancyTest/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getBreeding2SowInForSowPregnancyTest(p: {breedingGuid: string,recordGuid: string, lang: string}): Observable<any> {
    return this.http.post<any>(`${this.base}SowPregnancyTest/GetBreeding2SowInForSowPregnancyTest`, p);
  }
}
