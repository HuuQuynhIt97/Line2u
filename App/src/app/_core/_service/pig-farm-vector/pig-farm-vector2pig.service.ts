
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigFarmVector2pig } from '../../_model/pig-farm-vector';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigFarmVector2pigService extends CURDService<PigFarmVector2pig> {
  private pigFarmVector2pigSource = new BehaviorSubject({} );
  currentPigFarmVector2pig = this.pigFarmVector2pigSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigFarmVector2pig", utilitiesService);
  }
  changePigFarmVector2pig(pigFarmVector2pig) {
    this.pigFarmVector2pigSource.next(pigFarmVector2pig)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
