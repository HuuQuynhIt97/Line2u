
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Record2PigIn } from '../../_model/apply-orders/model';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Record2PigInService extends CURDService<Record2PigIn> {
  private recordSource = new BehaviorSubject([] );
  currentRecord2PigIn = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject([] );
  currentRecord2PigIn2 = this.recordSource2.asObservable();

  private realTotalWeightSource = new BehaviorSubject(0);
  realTotalWeightCurrent = this.realTotalWeightSource.asObservable();

  private realQtySource = new BehaviorSubject(0 );
  realQtyCurrent = this.realQtySource.asObservable();

  private endEditSource = new BehaviorSubject(false);
  endEditCurrent = this.endEditSource.asObservable();

  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Record2PigIn", utilitiesService);
  }
  changeRecord2PigIn(value) {
    this.recordSource.next(value)
  }

  realTotalWeightChange(value) {
    this.realTotalWeightSource.next(value)
  }

  realQtyChange(value) {
    this.realQtySource.next(value)
  }
  endEditChange(value) {
    this.endEditSource.next(value)
  }
}
