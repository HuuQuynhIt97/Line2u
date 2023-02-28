
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoarSilo } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoarSiloService extends CURDService<BoarSilo> {
  private BoarSource = new BehaviorSubject({} );
  currentBoarSilo = this.BoarSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BoarSilo", utilitiesService);
  }
  changeBoarSilo(farm) {
    this.BoarSource.next(farm)
  }
  toggleBoarDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarSilo/toggleBoarDate?id=${id}`, {});
  }
  getByBoarGuid(upperguid, upperBoar): Observable<any> {
    return this.http.get<any>(`${this.base}BoarSilo/GetByBoarGuid?upperguid=${upperguid}&upperBoar=${upperBoar}`, {});
  }
}
