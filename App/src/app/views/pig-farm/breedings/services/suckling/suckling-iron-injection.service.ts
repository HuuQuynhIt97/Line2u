import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingIronInjection } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingIronInjectionService extends CURDService<SucklingIronInjection> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingIronInjection = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingIronInjection", utilitiesService);
  }
  changeSucklingIronInjection(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingIronInjection/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}