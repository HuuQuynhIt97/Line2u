
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordStolen } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordStolenService extends CURDService<RecordStolen> {
  private recordSource = new BehaviorSubject({} );
  currentRecordStolen = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordStolen", utilitiesService);
  }
  changeRecordStolen(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordStolen/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordStolen/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getFilesById(id): Observable<any> {
    return this.http.get<any>(`${this.base}RecordStolen/GetFilesById?id=${id}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordStolen/GetByGuid?guid=${guid}`, {});
  }
}

