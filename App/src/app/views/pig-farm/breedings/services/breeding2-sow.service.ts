
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Breeding2Sow } from '../config';


@Injectable({
  providedIn: 'root'
})
export class Breeding2SowService extends CURDService<Breeding2Sow> {
  private biosSource = new BehaviorSubject({} );
  currentBreeding2Sow = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Breeding2Sow", utilitiesService);
  }
  changeBreeding2Sow(farm) {
    this.biosSource.next(farm)
  }
  getBreeding2SowIn(breedingGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Sow/GetBreeding2SowIn?breedingGuid=${breedingGuid}`, {});
  }
  getBreeding2Sow(obj: {breedingGuid: string, recordGuid: string, lang: string}): Observable<any> {
    return this.http.post<any>(`${this.base}Breeding2Sow/GetBreeding2Sow`, obj);
  }
}
