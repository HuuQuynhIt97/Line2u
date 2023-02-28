
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boar2SemenMix } from '../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Boar2SemenMixService extends CURDService<Boar2SemenMix> {
  private biosSource = new BehaviorSubject({} );
  currentBoar2SemenMix = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Boar2SemenMix", utilitiesService);
  }
  changeBoar2SemenMix(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
