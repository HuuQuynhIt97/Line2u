import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowAbortion } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowAbortionService extends CURDService<SowAbortion> {
  private recordSource = new BehaviorSubject({} );
  currentSowAbortion = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowAbortion", utilitiesService);
  }
  changeSowAbortion(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowAbortion/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}
