
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breeding2SowIn } from '../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Breeding2SowInService extends CURDService<Breeding2SowIn> {
  private biosSource = new BehaviorSubject({} );
  currentBreeding2SowIn = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Breeding2SowIn", utilitiesService);
  }
  changeBreeding2SowIn(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  // uu tien su dung ham nay
  getSelectedSowIn(obj: {breedingGuid: string, recordGuid: string, lang: string}): Observable<any> {

    return this.http.post<any>(`${this.base}Breeding2SowIn/GetSelectedSowIn`, obj);
  }
  // uu tien su dung ham nay
  getSelectedSowInForHeating(obj: {breedingGuid: string, recordGuid: string, lang: string}): Observable<any> {

    return this.http.post<any>(`${this.base}Breeding2SowIn/GetSelectedSowInForHeating`, obj);
  }
}
