import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rfid } from '../../_model/inventories';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RfidService extends CURDService<Rfid> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Rfid", utilitiesService);
  }
  getRfids(farmGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Rfid/GetRfids?farmGuid=${farmGuid}`, {});
  }
}
