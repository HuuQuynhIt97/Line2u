import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigDisease2pen } from '../../_model/pig-disease';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigDisease2penService extends CURDService<PigDisease2pen> {
  private pigDisease2penSource = new BehaviorSubject({} );
  currentPigDisease2pen = this.pigDisease2penSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigDisease2pen", utilitiesService);
  }
  changePigDisease2pen(pigDisease2pen) {
    this.pigDisease2penSource.next(pigDisease2pen)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
