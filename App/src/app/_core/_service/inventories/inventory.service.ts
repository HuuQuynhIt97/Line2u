import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inventory } from '../../_model/inventories';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InventoryService extends CURDService<Inventory> {
  private biosSource = new BehaviorSubject({} );
  currentInventory = this.biosSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Inventory", utilitiesService);
  }
  changeInventory(farm) {
    this.biosSource.next(farm)
  }
  getToInventories(farmGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Inventory/GetToInventories?farmGuid=${farmGuid}`, {});
  }
}
