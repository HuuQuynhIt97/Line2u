import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Contract } from '../../_model/evse/model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContractService extends CURDService<Contract> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Contract", utilitiesService);
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Contract/GetByGuidV2?guid=${guid}`, {});
  }
}
