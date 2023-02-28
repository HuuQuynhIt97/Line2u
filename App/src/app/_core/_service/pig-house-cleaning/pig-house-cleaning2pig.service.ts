import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigHouseCleaning2pig } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseCleaning2pigService extends CURDService<PigHouseCleaning2pig> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseCleaning2pig = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseCleaning2pig", utilitiesService);
  }
  changePigHouseCleaning2pig(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
