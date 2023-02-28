
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewBoarIn } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewBoarInService extends CURDService<NewBoarIn> {
  private recordSource = new BehaviorSubject({} );
  currentNewBoarIn = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"NewBoarIn", utilitiesService);
  }
  changeNewBoarIn(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}NewBoarIn/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}NewBoarIn/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  
}
