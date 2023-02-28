import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowPreFarrow } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowPreFarrowService extends CURDService<SowPreFarrow> {
  private recordSource = new BehaviorSubject({} );
  currentSowPreFarrow = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowPreFarrow", utilitiesService);
  }
  changeSowPreFarrow(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowPreFarrow/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}
