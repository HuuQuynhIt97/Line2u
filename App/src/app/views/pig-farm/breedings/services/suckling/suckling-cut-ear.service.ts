import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingCutEar } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingCutEarService extends CURDService<SucklingCutEar> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingCutEar = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingCutEar", utilitiesService);
  }
  changeSucklingCutEar(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingCutEar/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}