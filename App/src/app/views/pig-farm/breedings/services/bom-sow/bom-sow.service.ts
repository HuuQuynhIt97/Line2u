import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BomSow, Environment } from '../../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BomSowService extends CURDService<BomSow> {
  private bomSowSource = new BehaviorSubject({} );
  currentBomSow = this.bomSowSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BomSow", utilitiesService);
  }
  changeBomSow(farm) {
    this.bomSowSource.next(farm)
  }
  getBomSowByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}BomSow/GetBomSowByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  getByGuid(guid) {
    return this.http.get<any>(`${this.base}BomSow/GetByGuid?guid=${guid}`, {});
  }

  
}
