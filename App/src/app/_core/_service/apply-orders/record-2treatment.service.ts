
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Record2Treatment, UpdateWeightParams } from '../../_model/apply-orders/model';
import { OperationResult } from '../../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Record2TreatmentService extends CURDService<Record2Treatment> {
  private recordSource = new BehaviorSubject([] );
  currentRecord2Treatment = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject([] );
  currentRecord2Treatment2 = this.recordSource2.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Record2Treatment", utilitiesService);
  }
  changeRecord2Treatment(value) {
    this.recordSource.next(value)
  }
}
