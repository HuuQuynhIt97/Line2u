
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoarRide } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BoarRideService extends CURDService<BoarRide> {
  private recordSource = new BehaviorSubject({} );
  currentBoarRide = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BoarRide", utilitiesService);
  }
  changeBoarRide(farm) {
    this.recordSource.next(farm)
  }
  toggleRecordDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarRide/toggleRecordDate?id=${id}`, {});
  }
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}BoarRide/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  demoConfigHeaderAndData(): Observable<any> {
    return this.http.get<any>(`${this.base}BoarRide/DemoConfigHeaderAndData`, {});
  }

}
