import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingCastration } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingCastrationService extends CURDService<SucklingCastration> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingCastration = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingCastration", utilitiesService);
  }
  changeSucklingCastration(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingCastration/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}