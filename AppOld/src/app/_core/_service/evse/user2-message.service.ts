import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { User2Message } from '../../_model/evse/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class User2MessageService extends CURDService<User2Message> {
  private recordSource = new BehaviorSubject(null );
  currentUser2Message = this.recordSource.asObservable();

  changeUser2Message(value) {
    this.recordSource.next(value)
  }
  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"User2Message", utilitiesService);
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}User2Message/GetByGuidV2?guid=${guid}`, {});
  }

  countByUserId(guid): Observable<any> {
    return this.http.get<any>(`${this.base}User2Message/CountByUserId?guid=${guid}`, {});
  }
  seen(guid: string): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}User2Message/Seen?guid=${guid}`, {}).pipe(catchError(this.handleError));
  }
}
