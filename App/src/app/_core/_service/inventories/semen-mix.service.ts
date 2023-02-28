import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { SemenMix } from '../../_model/inventories';
@Injectable({
  providedIn: 'root'
})
export class SemenMixService extends CURDService<SemenMix> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SemenMix", utilitiesService);
  }
  getSemenMixes(farmGuid): Observable<any> {
    return this.http.get<any>(`${this.base}SemenMix/GetSemenMixes?farmGuid=${farmGuid}`, {});
  }
}
