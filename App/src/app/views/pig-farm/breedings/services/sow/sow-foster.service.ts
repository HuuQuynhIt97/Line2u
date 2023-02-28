import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowFoster } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowFosterService extends CURDService<SowFoster> {
 private recordSource = new BehaviorSubject({} );
  currentSowFoster = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowFoster", utilitiesService);
  }
  changeSowFoster(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowFoster/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}
