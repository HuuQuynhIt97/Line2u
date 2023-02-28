import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowHeating } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowHeatingService extends CURDService<SowHeating> {
  private recordSource = new BehaviorSubject({} );
  currentSowHeating = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowHeating", utilitiesService);
  }
  changeSowHeating(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowHeating/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
  
}
