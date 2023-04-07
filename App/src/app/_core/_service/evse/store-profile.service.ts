import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { StoreProfile } from '../../_model/xaccount';

@Injectable({
  providedIn: 'root'
})
export class StoreProfileService extends CURDService<StoreProfile> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"StoreProfile", utilitiesService);
  }
 
  GetWithGuid(key) {
    return this.http.get<any>(`${this.base}StoreProfile/GetWithGuid?guid=${key}`, {});
  }
  GetAll() {
    return this.http.get<any>(`${this.base}StoreProfile/GetAll`, {});
  }
 
  insertForm(model: StoreProfile): Observable<OperationResult> {
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
    return this.http.post<OperationResult>(`${this.base}StoreProfile/AddForm`, params).pipe(catchError(this.handleError));
  }
  insertFormMobile(model: StoreProfile): Observable<OperationResult> {
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
    return this.http.post<OperationResult>(`${this.base}StoreProfile/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: StoreProfile): Observable<OperationResult> {
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

    return this.http.put<OperationResult>(`${this.base}StoreProfile/updateForm`, params).pipe(catchError(this.handleError));
  }
  
  updateFormMobile(model: StoreProfile): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    // const file = model.file;
    // delete model.file;
    const params = this.utilitiesService.ToFormData(model);
    // params.append("file", file);
    if (model.file?.length > 0) {
      for (var i = 0; i < model.file?.length; i++) {
        params.append('file', model.file[i]);
      }
    }
    return this.http.put<OperationResult>(`${this.base}StoreProfile/updateFormMobile`, params).pipe(catchError(this.handleError));
  }
 
  getProfile(key) {
    return this.http.get<any>(`${this.base}StoreProfile/GetProfile?key=${key}`, {});
  }
  getRatingAndComment(key) {
    return this.http.get<any>(`${this.base}StoreProfile/GetRatingAndComment?storeGuid=${key}`, {});
  }

  checkRatingAndComment(key,id) {
    return this.http.get<any>(`${this.base}StoreProfile/CheckRatingAndComment?storeGuid=${key}&userId=${id}`, {});
  }

  postRatingComment(key) {
    return this.http.post<any>(`${this.base}StoreProfile/AddRatingComment`, key);
  }

  deleteImage(key) {
    return this.http.post(`${this.base}StoreProfile/DeleteUploadFile?key=${key}`,{});
  }
 
}
