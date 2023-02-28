
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowFeeding } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowFeedingService extends CURDService<SowFeeding> {
  private SowSource = new BehaviorSubject({} );
  currentSowFeeding = this.SowSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SowFeeding", utilitiesService);
  }
  changeSowFeeding(farm) {
    this.SowSource.next(farm)
  }
  toggleSowDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}SowFeeding/toggleSowDate?id=${id}`, {});
  }
  toggleEstDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}SowFeeding/toggleEstDate?id=${id}`, {});
  }
  getBySowGuid(upperguid, upperSow): Observable<any> {
    return this.http.get<any>(`${this.base}SowFeeding/GetBySowGuid?upperguid=${upperguid}&upperSow=${upperSow}`, {});
  }
}
