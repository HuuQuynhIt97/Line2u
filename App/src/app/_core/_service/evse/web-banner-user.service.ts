import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { WebBanner, WebBannerUser } from '../../_model/evse/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebBannerUserService extends CURDService<WebBannerUser> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"WebBannerUser", utilitiesService);
  }

  insertForm(model: WebBannerUser): Observable<OperationResult> {
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
    return this.http.post<OperationResult>(`${this.base}WebBannerUser/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: WebBannerUser): Observable<OperationResult> {
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

    return this.http.put<OperationResult>(`${this.base}WebBannerUser/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}WebBannerUser/GetByGuid?guid=${guid}`, {});
  }
  getByUserID(userID): Observable<any> {
    return this.http.get<any>(`${this.base}WebBannerUser/GetByUserID?userID=${userID}`, {});
  }
  getByStoreId(storeId): Observable<any> {
    return this.http.get<any>(`${this.base}WebBannerUser/GetByStoreId?storeId=${storeId}`, {});
  }
  getWebBanners(): Observable<any> {
    return this.http.get<any>(`${this.base}WebBannerUser/GetWebBanners`, {});
  }

}
