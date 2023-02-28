
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breeding2SowBodyCondition } from '../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Breeding2SowBodyConditionService extends CURDService<Breeding2SowBodyCondition> {
  private biosSource = new BehaviorSubject({} );
  currentBreeding2SowBodyCondition = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Breeding2SowBodyCondition", utilitiesService);
  }
  changeBreeding2SowBodyCondition(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
