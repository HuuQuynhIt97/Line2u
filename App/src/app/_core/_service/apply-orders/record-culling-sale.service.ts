
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordCullingSale } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordCullingSaleService extends CURDService<RecordCullingSale> {
  private recordSource = new BehaviorSubject({} );
  currentRecordCullingSale = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordCullingSale", utilitiesService);
  }
  changeRecordCullingSale(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordCullingSale/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordCullingSale/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getFilesById(id): Observable<any> {
    return this.http.get<any>(`${this.base}RecordCullingSale/GetFilesById?id=${id}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordCullingSale/GetByGuid?guid=${guid}`, {});
  }
}