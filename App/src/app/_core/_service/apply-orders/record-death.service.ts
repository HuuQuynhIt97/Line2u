
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordDeath } from '../../_model/records';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordDeathService extends CURDService<RecordDeath> {
  private recordSource = new BehaviorSubject({} );
  currentRecordDeath = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordDeath", utilitiesService);
  }
  changeRecordDeath(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordDeath/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordDeath/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  demoConfigHeaderAndData(): Observable<any> {
    return this.http.get<any>(`${this.base}RecordDeath/DemoConfigHeaderAndData`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordDeath/GetByGuid?guid=${guid}`, {});
  }
}
