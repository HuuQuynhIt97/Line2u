import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BomBoar, Environment } from '../../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BomBoarService extends CURDService<BomBoar> {
  private bomSowSource = new BehaviorSubject({} );
  currentBomBoar = this.bomSowSource.asObservable();
  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BomBoar", utilitiesService);
  }
  changeBomBoar(farm) {
    this.bomSowSource.next(farm)
  }
  getBomBoarByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}BomBoar/GetBomBoarByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  getByGuid(guid) {
    return this.http.get<any>(`${this.base}BomBoar/GetByGuid?guid=${guid}`, {});
  }

  
}
