
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordPigOut } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordPigOutService extends CURDService<RecordPigOut> {
  private recordSource = new BehaviorSubject({} );
  currentRecordPigOut = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordPigOut", utilitiesService);
  }
  changeRecordPigOut(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordPigOut/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordPigOut/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  transferCalculate(guid, inOutQty, inOutWeight, transferType ): Observable<any> {
    return this.http.get<any>(`${this.base}RecordPigOut/TransferCalculate?guid=${guid}&inOutQty=${inOutQty}&inOutWeight=${inOutWeight}&transferType=${transferType}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordPigOut/GetByGuid?guid=${guid}`, {});
  }
}