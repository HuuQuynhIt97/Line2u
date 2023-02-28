import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowWeaning } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SowWeaningService extends CURDService<SowWeaning> {
  private recordSource = new BehaviorSubject({} );
  currentSowWeaning = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SowWeaning", utilitiesService);
  }
  changeSowWeaning(farm) {
    this.recordSource.next(farm)
  }
  
  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SowWeaning/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}
