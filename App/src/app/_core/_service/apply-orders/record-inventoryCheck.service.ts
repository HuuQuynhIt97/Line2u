
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordInventoryCheck } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordInventoryCheckService extends CURDService<RecordInventoryCheck> {
  private recordSource = new BehaviorSubject({} );
  currentRecordInventoryCheck = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordInventoryCheck", utilitiesService);
  }
  changeRecordInventoryCheck(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordInventoryCheck/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordInventoryCheck/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordInventoryCheck/GetByGuid?guid=${guid}`, {});
  }
}
