import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { WebNews, WebNewsUser } from '../../_model/evse/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebNewsUserService  extends CURDService<WebNewsUser>{

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"WebNewsUser", utilitiesService);
  }

  insertForm(model: WebNewsUser): Observable<OperationResult> {
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
    const fileThumbnail = model.fileThumnail;
    delete model.fileThumnail;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    params.append("fileThumbnail", fileThumbnail);
    return this.http.post<OperationResult>(`${this.base}WebNewsUser/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: WebNewsUser): Observable<OperationResult> {
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
    const fileThumbnail = model.fileThumnail;
    delete model.fileThumnail;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    params.append("fileThumbnail", fileThumbnail);

    return this.http.put<OperationResult>(`${this.base}WebNewsUser/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}WebNewsUser/GetByGuid?guid=${guid}`, {});
  }
  getByUserID(userID): Observable<any> {
    return this.http.get<any>(`${this.base}WebNewsUser/GetByUserID?userID=${userID}`, {});
  }
  getWebNews(): Observable<any> {
    return this.http.get<any>(`${this.base}WebNewsUser/GetWebNews`, {});
  }
  getWebPages(): Observable<any> {
    return this.http.get<any>(`${this.base}WebNews/GetWebPages`, {});
  }

}
