
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoarSemenMix } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BoarSemenMixService extends CURDService<BoarSemenMix> {
  private recordSource = new BehaviorSubject({} );
  currentBoarSemenMix = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BoarSemenMix", utilitiesService);
  }
  changeBoarSemenMix(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarSemenMix/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}BoarSemenMix/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  demoConfigHeaderAndData(): Observable<any> {
    return this.http.get<any>(`${this.base}BoarSemenMix/DemoConfigHeaderAndData`, {});
  }

}
