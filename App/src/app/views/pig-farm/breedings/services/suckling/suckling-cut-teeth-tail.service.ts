import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingCutTeethTail } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingCutTeethTailService extends CURDService<SucklingCutTeethTail> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingCutTeethTail = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingCutTeethTail", utilitiesService);
  }
  changeSucklingCutTeethTail(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingCutTeethTail/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}