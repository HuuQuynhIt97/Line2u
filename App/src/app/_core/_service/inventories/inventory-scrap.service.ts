import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InventoryScrap } from '../../_model/inventories';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InventoryScrapService extends CURDService<InventoryScrap> {
  private biosSource = new BehaviorSubject({} );
  currentInventoryScrap = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"InventoryScrap", utilitiesService);
  }
  changeInventoryScrap(farm) {
    this.biosSource.next(farm)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
