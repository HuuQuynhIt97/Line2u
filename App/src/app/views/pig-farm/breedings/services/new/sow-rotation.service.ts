
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowRotation } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class SowRotationService extends CURDService<SowRotation> {
  private recordSource = new BehaviorSubject({} );
  currentSowRotation = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SowRotation", utilitiesService);
  }
  changeSowRotation(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}SowRotation/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowRotation/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  demoConfigHeaderAndData(): Observable<any> {
    return this.http.get<any>(`${this.base}SowRotation/DemoConfigHeaderAndData`, {});
  }

}
