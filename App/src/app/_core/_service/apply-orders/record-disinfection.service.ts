
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordDisinfection } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordDisinfectionService extends CURDService<RecordDisinfection> {
  private recordSource = new BehaviorSubject({} );
  currentRecordDisinfection = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordDisinfection", utilitiesService);
  }
  changeRecordDisinfection(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordDisinfection/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordDisinfection/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordDisinfection/GetByGuid?guid=${guid}`, {});
  }
}
