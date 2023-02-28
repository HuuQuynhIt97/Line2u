import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigFarmVectorSchedule } from '../../_model/pig-farm-vector';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigFarmVectorScheduleService extends CURDService<PigFarmVectorSchedule> {
  private pigFarmVectorScheduleSource = new BehaviorSubject({} );
  currentPigFarmVectorSchedule = this.pigFarmVectorScheduleSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigFarmVectorSchedule", utilitiesService);
  }
  changePigFarmVectorSchedule(pigFarmVectorSchedule) {
    this.pigFarmVectorScheduleSource.next(pigFarmVectorSchedule)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
