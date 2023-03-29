
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Record2Market, UpdateWeightParams } from '../../_model/apply-orders/model';
import { OperationResult } from '../../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Record2MarketService extends CURDService<Record2Market> {
  private recordSource = new BehaviorSubject([] );
  currentRecord2Market = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject([] );
  currentRecord2Market2 = this.recordSource2.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Record2Market", utilitiesService);
  }
  changeRecord2Market(value) {
    this.recordSource.next(value)
  }
}
