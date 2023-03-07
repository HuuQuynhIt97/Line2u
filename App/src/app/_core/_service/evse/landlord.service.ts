import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Landlord } from '../../_model/evse/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { XAccount } from '../../_model/xaccount';
@Injectable({
  providedIn: 'root'
})
export class LandlordService extends CURDService<Landlord> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Landlord", utilitiesService);
  }
  private recordSource = new BehaviorSubject(null );
  currentLandlord = this.recordSource.asObservable();
  changeLandlord(value) {
    this.recordSource.next(value)
  }
  insertForm(model: Landlord): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
    const file = model.file;
    delete model.file;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    return this.http.post<OperationResult>(`${this.base}Landlord/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: XAccount): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const file = model.file;
    delete model.file;
   
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);

    return this.http.put<OperationResult>(`${this.base}Landlord/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Landlord/GetByGuid?guid=${guid}`, {});
  }
  getBankAccountByLandlordGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Landlord/GetBankAccountByLandlordGuid?guid=${guid}`, {});
  }
  
}
