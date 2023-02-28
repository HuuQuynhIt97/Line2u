
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoarFeeding } from '../../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from 'src/app/_core/_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class BoarFeedingService extends CURDService<BoarFeeding> {
  private BoarSource = new BehaviorSubject({} );
  currentBoarFeeding = this.BoarSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BoarFeeding", utilitiesService);
  }
  changeBoarFeeding(farm) {
    this.BoarSource.next(farm)
  }
  toggleBoarDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarFeeding/toggleBoarDate?id=${id}`, {});
  }
  toggleEstDate(id): Observable<OperationResult> {
    return this.http.get<OperationResult>(`${this.base}BoarFeeding/toggleEstDate?id=${id}`, {});
  }
  getByBoarGuid(upperguid, upperBoar): Observable<any> {
    return this.http.get<any>(`${this.base}BoarFeeding/GetByBoarGuid?upperguid=${upperguid}&upperBoar=${upperBoar}`, {});
  }
  
}
