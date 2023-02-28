
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breeding2SowBackFat } from '../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Breeding2SowBackFatService extends CURDService<Breeding2SowBackFat> {
  private biosSource = new BehaviorSubject({} );
  currentBreeding2SowBackFat = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Breeding2SowBackFat", utilitiesService);
  }
  changeBreeding2SowBackFat(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
