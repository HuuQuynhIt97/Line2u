import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { PigHouseDisinfection } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseDisinfectionService extends CURDService<PigHouseDisinfection> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseDisinfection = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseDisinfection", utilitiesService);
  }
  changePigHouseDisinfection(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}PigHouseDisinfection/ToggleRecordDate?id=${id}`, {});
  }
}
