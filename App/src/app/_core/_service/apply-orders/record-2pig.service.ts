
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Record2Pig, UpdateWeightParams } from '../../_model/apply-orders/model';
import { OperationResult } from '../../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Record2PigService extends CURDService<Record2Pig> {
  private recordSource = new BehaviorSubject({} );
  currentRecord2Pig = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject({} );
  currentRecord2Pig2 = this.recordSource2.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Record2Pig", utilitiesService);
  }
  updateWeight(model: UpdateWeightParams): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}Record2Pig/UpdateWeight`, model)
      .pipe(catchError(this.handleError));
  }
  private record2PigSource = new BehaviorSubject([] );
  currentRecord2PigArray = this.record2PigSource.asObservable();

  changeRecord2Pig(values) {
    this.record2PigSource.next(values)
  }


  private record2PigSourceModal = new BehaviorSubject([] );
  currentRecord2PigArrayModal = this.record2PigSourceModal.asObservable();

  changeRecord2PigModal(values) {
    this.record2PigSourceModal.next(values)
  }
}
