
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SalesOrderCheckOut } from '../../_model/sale-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SalesOrderCheckOutService extends CURDService<SalesOrderCheckOut> {
  private biosSource = new BehaviorSubject({} );
  currentSalesOrderCheckOut = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"SalesOrderCheckOut", utilitiesService);
  }
  changeSalesOrderCheckOut(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}

