import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { WebNews } from '../../_model/evse/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MainCategory } from '../../_model/evse/mainCategory';

@Injectable({
  providedIn: 'root'
})
export class MainCategoryService extends CURDService<MainCategory> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"MainCategory", utilitiesService);
  }

  insertForm(model: MainCategory): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const params = this.utilitiesService.ToFormData(model);

    return this.http.post<OperationResult>(`${this.base}MainCategory/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: MainCategory): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const params = this.utilitiesService.ToFormData(model);

    return this.http.put<OperationResult>(`${this.base}MainCategory/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/GetByGuid?guid=${guid}`, {});
  }
  getWebNews(): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/GetWebNews`, {});
  }
  getWebPages(): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/GetWebPages`, {});
  }
  getCategoryByUserID(guid): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/getCategoryByUserID?id=${guid}`, {});
  }
  getCategoryByUserIDAndStore(guid,storeId): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/GetCategoryByUserIDAndStore?id=${guid}&storeId=${storeId}`, {});
  }
  getProducts(store_guid,cus_guid,storeId): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/getProducts?id=${store_guid}&cusGuid=${cus_guid}&storeId=${storeId}`, {});
  }

  getProductsOrderEdit(store_guid,cus_guid,date,orderId): Observable<any> {
    return this.http.get<any>(`${this.base}MainCategory/GetProductsOrderEdit?id=${store_guid}&cusId=${cus_guid}&date=${date}&orderId=${orderId}`, {});
  }

}
