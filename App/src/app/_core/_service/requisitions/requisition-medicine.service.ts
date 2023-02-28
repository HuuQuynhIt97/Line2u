
import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';
  import { RequisitionMedicine } from '../../_model/requisitions';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


  @Injectable({
    providedIn: 'root'
  })
  export class RequisitionMedicineService extends CURDService<RequisitionMedicine> {
    private biosSource = new BehaviorSubject({} );
    currentRequisitionMedicine = this.biosSource.asObservable();
    constructor( http: HttpClient,utilitiesService: UtilitiesService)
    {
      super(environment.apiUrl,http,"RequisitionMedicine", utilitiesService);
    }
    changeRequisitionMedicine(farm) {
      this.biosSource.next(farm)
    }
    // toggleIsDefault(id): Observable<OperationResult> {
    //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
    //     catchError(this.handleError)
    //   );
    // }
  }
