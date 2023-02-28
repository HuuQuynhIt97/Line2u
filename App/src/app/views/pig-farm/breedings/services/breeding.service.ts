import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Breeding } from '../config';

@Injectable({
  providedIn: 'root'
})
export class BreedingService extends CURDService<Breeding> {

  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"Breeding", utilitiesService);
  }

  getBreedingByFarmGuid(farmGuid) {
    return this.http.get<any>(`${this.base}Breeding/GetBreedingByFarmGuid?farmGuid=${farmGuid}`, {});
  }
  getByGuid(guid) {
    return this.http.get<any>(`${this.base}Breeding/GetByGuid?guid=${guid}`, {});
  }
  getBreeding2SowInByBreedingGuid(breedingGuid) {
    return this.http.get<any>(`${this.base}Breeding/GetBreeding2SowInByBreedingGuid?breedingGuid=${breedingGuid}`, {});
  }
  

  
}
