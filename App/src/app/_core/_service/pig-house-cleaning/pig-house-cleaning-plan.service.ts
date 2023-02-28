import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigHouseCleaningPlan } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseCleaningPlanService extends CURDService<PigHouseCleaningPlan> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseCleaningPlan = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseCleaningPlan", utilitiesService);
  }
  changePigHouseCleaningPlan(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
