
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoarSemenTesting } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BoarSemenTestingService extends CURDService<BoarSemenTesting> {
  private recordSource = new BehaviorSubject({} );
  currentBoarSemenTesting = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BoarSemenTesting", utilitiesService);
  }
  changeBoarSemenTesting(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarSemenTesting/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}BoarSemenTesting/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  demoConfigHeaderAndData(): Observable<any> {
    return this.http.get<any>(`${this.base}BoarSemenTesting/DemoConfigHeaderAndData`, {});
  }

}
