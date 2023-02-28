
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { RecordWeighing } from '../../_model/records';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecordWeighingService extends CURDService<RecordWeighing> {
  private recordSource = new BehaviorSubject({} );
  currentRecordWeighing = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"RecordWeighing", utilitiesService);
  }
  changeRecordWeighing(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordWeighing/toggleRecordDate?id=${id}`, {});
  }
  toggleEstDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}RecordWeighing/toggleEstDate?id=${id}`, {});
  }
}
