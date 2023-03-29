import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { ParkingLot } from '../../_model/evse/model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ParkingLotService extends CURDService<ParkingLot> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"ParkingLot", utilitiesService);
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}ParkingLot/GetByGuid?guid=${guid}`, {});
  }
}
