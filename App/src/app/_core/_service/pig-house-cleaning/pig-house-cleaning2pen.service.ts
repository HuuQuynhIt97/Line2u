import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigHouseCleaning2pen } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseCleaning2penService extends CURDService<PigHouseCleaning2pen> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseCleaning2pen = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseCleaning2pen", utilitiesService);
  }
  changePigHouseCleaning2pen(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
