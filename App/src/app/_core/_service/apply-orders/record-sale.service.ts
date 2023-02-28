
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordSale } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordSaleService extends CURDService<RecordSale> {
  private recordSource = new BehaviorSubject({} );
  currentRecordSale = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordSale", utilitiesService);
  }
  changeRecordSale(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordSale/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}RecordSale/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  getFilesById(id): Observable<any> {
    return this.http.get<any>(`${this.base}RecordSale/GetFilesById?id=${id}`, {});
  }
  getByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}RecordSale/GetByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  accidentCalculate(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordSale/AccidentCalculate?guid=${guid}`, {});
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}RecordSale/GetByGuid?guid=${guid}`, {});
  }
}
