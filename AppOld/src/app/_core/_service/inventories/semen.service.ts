import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Semen } from '../../_model/inventories';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SemenService extends CURDService<Semen> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Semen", utilitiesService);
  }
  getSemens(farmGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Semen/GetSemens?farmGuid=${farmGuid}`, {});
  }
}
