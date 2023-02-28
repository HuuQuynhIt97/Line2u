import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SalesOrder } from '../../_model/sale-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SalesOrderService extends CURDService<SalesOrder> {
  private salesOrderSource = new BehaviorSubject({} );
  currentSalesOrder = this.salesOrderSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SalesOrder", utilitiesService);
  }
  changeSalesOrder(salesOrder) {
    this.salesOrderSource.next(salesOrder)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
