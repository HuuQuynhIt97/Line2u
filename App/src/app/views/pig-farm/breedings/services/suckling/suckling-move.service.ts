import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SucklingMove } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SucklingMoveService extends CURDService<SucklingMove> {
  private recordSource = new BehaviorSubject({} );
  currentSucklingMove = this.recordSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"SucklingMove", utilitiesService);
  }
  changeSucklingMove(farm) {
    this.recordSource.next(farm)
  }

  getByRecordGuid(upperguid, upperrecord): Observable<any> {
    return this.http.get<any>(`${this.base}SucklingMove/GetByRecordGuid?upperguid=${upperguid}&upperrecord=${upperrecord}`, {});
  }
}