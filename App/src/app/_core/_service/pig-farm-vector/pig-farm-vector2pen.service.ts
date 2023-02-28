
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigFarmVector2pen } from '../../_model/pig-farm-vector';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigFarmVector2penService extends CURDService<PigFarmVector2pen> {
  private pigFarmVector2penSource = new BehaviorSubject({} );
  currentPigFarmVector2pen = this.pigFarmVector2penSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigFarmVector2pen", utilitiesService);
  }
  changePigFarmVector2pen(pigFarmVector2pen) {
    this.pigFarmVector2penSource.next(pigFarmVector2pen)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
