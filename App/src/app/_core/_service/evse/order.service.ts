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

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CURDService<Order>  {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Order", utilitiesService);
  }

  insertForm(model: Order): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
  
    const params = this.utilitiesService.ToFormData(model);
    
    return this.http.post<OperationResult>(`${this.base}Order/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: Order): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const params = this.utilitiesService.ToFormData(model);

    return this.http.put<OperationResult>(`${this.base}Order/updateForm`, params).pipe(catchError(this.handleError));
  }
  getByGuid(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetByGuid?guid=${guid}`, {});
  }
  getWebNews(): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetWebNews`, {});
  }
  getWebPages(): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetWebPages`, {});
  }
  getProducts(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Order/getProducts?id=${guid}`, {});
  }

  updateOrderDetail(model): Observable<any> {
    return this.http.post<any>(`${this.base}Order/UpdateOrderDetail`, model);
  }
  minusOrderDetail(model): Observable<any> {
    return this.http.post<any>(`${this.base}Order/MinusOrderDetail`, model);
  }
  deleteOrderDetail(model): Observable<any> {
    return this.http.post<any>(`${this.base}Order/DeleteOrderDetail`, model);
  }
  getTrackingOrderUser(guid): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetTrackingOrderUser?id=${guid}`, {});
  }
  getDetailOrder(guid,storeGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetDetailOrder?id=${guid}&storeGuid=${storeGuid}`, {});
  }

  confirmOrder(guid): Observable<any> {
    return this.http.post<any>(`${this.base}Order/ConfirmOrder?id=${guid}`, {});
  }
  cancelOrder(guid): Observable<any> {
    return this.http.post<any>(`${this.base}Order/CancelOrder?id=${guid}`, {});
  }
  getTrackingOrderForStore(guid,min,max): Observable<any> {
    return this.http.get<any>(`${this.base}Order/GetTrackingOrderForStore?id=${guid}&min=${min}&max=${max}`, {});
  }

}
