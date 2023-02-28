
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Breeding2Suckling } from '../config';


@Injectable({
  providedIn: 'root'
})
export class Breeding2SucklingService extends CURDService<Breeding2Suckling> {
  private biosSource = new BehaviorSubject({} );
  currentBreeding2Suckling = this.biosSource.asObservable();
  private endEditSource = new BehaviorSubject(false);
  endEditCurrent = this.endEditSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Breeding2Suckling", utilitiesService);
  }
  changeBreeding2Suckling(farm) {
    this.biosSource.next(farm)
  }
  
  getBreeding2Suckling(recordGuid, type, sowGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Suckling/GetBreeding2Suckling?recordGuid=${recordGuid}&type=${type}&sowGuid=${sowGuid}`, {});
  }
  getBreeding2SucklingV2(recordGuid, sowGuid, breedingGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Suckling/GetBreeding2SucklingV2?recordGuid=${recordGuid || ''}&sowGuid=${sowGuid || ''}&breedingGuid=${breedingGuid || ''}`, {});
  }
  getBreeding2SucklingV3(breedingGuid, sowGuid, recordGuid, type): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Suckling/GetBreeding2SucklingV3?breedingGuid=${breedingGuid || ''}&sowGuid=${sowGuid || ''}&recordGuid=${recordGuid || ''}&type=${type}`, {});
  }
  endEditChange(value) {
    this.endEditSource.next(value)
  }
  getBreeding2SucklingV4(breedingGuid, lang, sowGuid,recordGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Suckling/GetBreeding2SucklingV4?breedingGuid=${breedingGuid || ''}&lang=${lang || ''}&sowGuid=${sowGuid || ''}&recordGuid=${recordGuid || ''}`, {});
  }
  getBreeding2SucklingWeaning(breedingGuid, lang, sowGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Breeding2Suckling/GetBreeding2SucklingWeaning?breedingGuid=${breedingGuid || ''}&lang=${lang || ''}&sowGuid=${sowGuid || ''}`, {});
  }
  
}