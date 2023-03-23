import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { WebNews } from '../../_model/evse/model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MainCategory } from '../../_model/evse/mainCategory';
import { Products } from '../../_model/evse/products';
import { Order } from '../../_model/evse/order';
import { Cart } from '../../_model/evse/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService extends CURDService<Cart> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Cart", utilitiesService);
  }

  insertForm(model: Cart): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
  
    const params = this.utilitiesService.ToFormData(model);
    
    return this.http.post<OperationResult>(`${this.base}Cart/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: Cart): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const params = this.utilitiesService.ToFormData(model);

    return this.http.put<OperationResult>(`${this.base}Cart/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetByGuid?guid=${guid}`, {});
  }
  getWebNews(): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetWebNews`, {});
  }
  getWebPages(): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetWebPages`, {});
  }
  getProducts(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/getProducts?id=${guid}`, {});
  }
  getTrackingOrderUser(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetTrackingOrderUser?id=${guid}`, {});
  }
  getDetailOrder(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetDetailOrder?id=${guid}`, {});
  }
  getTrackingOrderForStore(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/GetTrackingOrderForStore?id=${guid}`, {});
  }

  cartAmountTotal(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/cartAmountTotal?accountGuid=${guid}`, {});
  }

  cartCountTotal(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/CartCountTotal?accountGuid=${guid}`, {});
  }
  getProductsInCart(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Cart/getProductsInCart?accountGuid=${guid}`, {});
  }

}
