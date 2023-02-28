
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SowSilo } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SowSiloService extends CURDService<SowSilo> {
  private SowSource = new BehaviorSubject({} );
  currentSowSilo = this.SowSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SowSilo", utilitiesService);
  }
  changeSowSilo(farm) {
    this.SowSource.next(farm)
  }
  toggleSowDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}SowSilo/toggleSowDate?id=${id}`, {});
  }
  getBySowGuid(upperguid, upperSow): Observable<any> {
    return this.http.get<any>(`${this.base}SowSilo/GetBySowGuid?upperguid=${upperguid}&upperSow=${upperSow}`, {});
  }
}
