
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordAbattoir } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordAbattoirService extends CURDService<RecordAbattoir> {
  private recordSource = new BehaviorSubject({} );
  currentRecordAbattoir = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordAbattoir", utilitiesService);
  }
  changeRecordAbattoir(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordAbattoir/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordAbattoir/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getFilesById(id): Observable<any> {
    return this.http.get<any>(`${this.base}RecordAbattoir/GetFilesById?id=${id}`, {});
  }
  getByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}RecordAbattoir/GetByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  accidentCalculate(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordAbattoir/AccidentCalculate?guid=${guid}`, {});
  }
}
