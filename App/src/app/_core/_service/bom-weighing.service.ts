import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { BOMWeighing } from '../_model/bom-weighing';
@Injectable({
  providedIn: 'root'
})
export class BOMWeighingService extends CURDService<BOMWeighing> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"BOMWeighing", utilitiesService);
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
