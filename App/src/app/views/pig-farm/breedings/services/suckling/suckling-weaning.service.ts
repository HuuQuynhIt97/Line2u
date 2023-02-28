import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingWeaning } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingWeaningService extends CURDService<SucklingWeaning> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingWeaning = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingWeaning", utilitiesService);
  }
  changeSucklingWeaning(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingWeaning/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}