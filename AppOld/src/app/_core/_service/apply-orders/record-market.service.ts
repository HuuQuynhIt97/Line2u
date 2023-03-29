
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RecordMarket, UpdateWeightParams } from '../../_model/apply-orders/model';
import { OperationResult } from '../../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecordMarketService extends CURDService<RecordMarket> {
  private recordSource = new BehaviorSubject([] );
  currentRecordMarket = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject([] );
  currentRecordMarket2 = this.recordSource2.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordMarket", utilitiesService);
  }
  changeRecordMarket(value) {
    this.recordSource.next(value)
  }
  import(file, recordGuid) {
    const formData = new FormData();
    formData.append('UploadedFile', file);
    formData.append('recordGuid', recordGuid);
    return this.http.post(this.base + 'RecordMarket/ImportExcel', formData);
  }
  deleteImportExcel(recordGuid) {
    return this.http.delete(this.base + 'RecordMarket/DeleteImportExcel?recordGuid=' + recordGuid);
  }
  getDataImportExcel(recordGuid) {
    return this.http.get(this.base + 'RecordMarket/GetDataImportExcel?recordGuid=' + recordGuid);
  }
}
