import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BomGilt, Environment } from '../../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BomGiltService extends CURDService<BomGilt> {
  private bomSowSource = new BehaviorSubject({} );
  currentBomGilt = this.bomSowSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BomGilt", utilitiesService);
  }
  changeBomGilt(farm) {
    this.bomSowSource.next(farm)
  }
  getBomGiltByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}BomGilt/GetBomGiltByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  getByGuid(guid) {
    return this.http.get<any>(`${this.base}BomGilt/GetByGuid?guid=${guid}`, {});
  }

  
}
