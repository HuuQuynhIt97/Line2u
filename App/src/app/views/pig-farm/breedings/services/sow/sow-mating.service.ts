import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowMating } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowMatingService  extends CURDService<SowMating> {

  private recordSource = new BehaviorSubject({} );
  currentSowMating = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowMating", utilitiesService);
  }
  changeSowMating(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowMating/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}
