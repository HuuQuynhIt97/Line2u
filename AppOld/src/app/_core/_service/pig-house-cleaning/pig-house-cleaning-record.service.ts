import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { PigHouseCleaningRecord } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseCleaningRecordService extends CURDService<PigHouseCleaningRecord> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseCleaningRecord = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseCleaningRecord", utilitiesService);
  }
  changePigHouseCleaningRecord(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}PigHouseCleaningRecord/toggleRecordDate?id=${id}`, {});
  }
}
