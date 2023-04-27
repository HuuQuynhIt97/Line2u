import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { WebNews } from '../../_model/evse/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MainCategory } from '../../_model/evse/mainCategory';
import { Products } from '../../_model/evse/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends CURDService<Products> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Products", utilitiesService);
  }

  insertForm(model: Products): Observable<OperationResult> {
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

    return this.http.post<OperationResult>(`${this.base}Products/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: Products): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
    // const productSize = model.productSize;
    // const productOption = model.productOption;

    // delete model.productSize
    // delete model.productOption
    const file = model.file;
    delete model.file;
    const params = this.utilitiesService.ToFormData(model);

    // if (productSize.length > 0) {
    //   for (var i = 0; i < productSize.length; i++) {
    //     params.append('ProductSize', productSize[i]);
    //   }
    // }

    // if (productOption.length > 0) {
    //   for (var i = 0; i < productOption.length; i++) {
    //     params.append('ProductOption', productOption[i]);
    //   }
    // }
    params.append("file", file);

    return this.http.put<OperationResult>(`${this.base}Products/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Products/GetByGuid?guid=${guid}`, {});
  }
  getWebNews(): Observable<any> {
    return this.http.get<any>(`${this.base}Products/GetWebNews`, {});
  }
  addSize(model): Observable<any> {
    return this.http.post<any>(`${this.base}Products/AddSize`, model);
  }

  addOption(model): Observable<any> {
    return this.http.post<any>(`${this.base}Products/addOption`, model);
  }
  getWebPages(): Observable<any> {
    return this.http.get<any>(`${this.base}Products/GetWebPages`, {});
  }
  getProducts(_categoryGuid,cusGuid,storeId): Observable<any> {
    return this.http.get<any>(`${this.base}Products/getProducts?id=${_categoryGuid}&cusGuid=${cusGuid}&storeId=${storeId}`, {});
  }

}
