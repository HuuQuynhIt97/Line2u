import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PigDiagnosis } from '../../_model/pig-disease';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PigDiagnosisService extends CURDService<PigDiagnosis> {
  private pigDiagnosisSource = new BehaviorSubject({} );
  currentPigDiagnosis = this.pigDiagnosisSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"PigDiagnosis", utilitiesService);
  }
  changePigDiagnosis(pigDiagnosis) {
    this.pigDiagnosisSource.next(pigDiagnosis)
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}BOM/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
