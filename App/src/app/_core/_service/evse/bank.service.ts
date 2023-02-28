import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Bank } from '../../_model/evse/model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BankService extends CURDService<Bank> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Bank", utilitiesService);
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Bank/GetByGuid?guid=${guid}`, {});
  }
}
