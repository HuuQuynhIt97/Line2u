import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowFarrow } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowFarrowService extends CURDService<SowFarrow> {
  private recordSource = new BehaviorSubject({} );
  currentSowFarrow = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowFarrow", utilitiesService);
  }
  changeSowFarrow(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowFarrow/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  born(obj : {recordGuid: any, qtyTotal: any, qtyALive: any}): Observable<any> {
    return this.http.post<any>(`${this.base}SowFarrow/Born`, obj);
  }
}
