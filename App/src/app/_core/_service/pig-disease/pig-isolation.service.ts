import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigIsolation } from '../../_model/pig-disease';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigIsolationService extends CURDService<PigIsolation> {
  private pigIsolationSource = new BehaviorSubject({} );
  currentPigIsolation = this.pigIsolationSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigIsolation", utilitiesService);
  }
  changePigIsolation(pigIsolation) {
    this.pigIsolationSource.next(pigIsolation)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
