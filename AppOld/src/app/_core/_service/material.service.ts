import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Material } from '../_model/material';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MaterialService extends CURDService<Material> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Material", utilitiesService);
  }
  getMaterials(farmGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Material/GetMaterials?farmGuid=${farmGuid}`, {});
  }
}
