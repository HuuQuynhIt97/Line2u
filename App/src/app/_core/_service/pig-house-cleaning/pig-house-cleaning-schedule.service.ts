import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigHouseCleaningSchedule } from '../../_model/pig-house-cleaning';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigHouseCleaningScheduleService extends CURDService<PigHouseCleaningSchedule> {
  private pigFarmVectorSource = new BehaviorSubject({} );
  currentPigHouseCleaningSchedule = this.pigFarmVectorSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigHouseCleaningSchedule", utilitiesService);
  }
  changePigHouseCleaningSchedule(pigFarmVector) {
    this.pigFarmVectorSource.next(pigFarmVector)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
