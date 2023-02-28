import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigPrescription } from '../../_model/pig-disease';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigPrescriptionService extends CURDService<PigPrescription> {
  private pigPrescriptionSource = new BehaviorSubject({} );
  currentPigPrescription = this.pigPrescriptionSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigPrescription", utilitiesService);
  }
  changePigPrescription(pigPrescription) {
    this.pigPrescriptionSource.next(pigPrescription)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
