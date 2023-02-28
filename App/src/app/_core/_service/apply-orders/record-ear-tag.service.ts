
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordEarTag } from '../../_model/records';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordEarTagService extends CURDService<RecordEarTag> {
  private recordSource = new BehaviorSubject({} );
  currentRecordEarTag = this.recordSource.asObservable();
  private recordLabelSource = new BehaviorSubject(null);
  currentRecordLabel = this.recordLabelSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordEarTag", utilitiesService);
  }
  changeRecordEarTag(farm) {
    this.recordSource.next(farm)
  }
  changLable(value) {
    this.recordLabelSource.next(value)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordEarTag/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordEarTag/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordEarTag/GetByGuid?guid=${guid}`, {});
  }
}
