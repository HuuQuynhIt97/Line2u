
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breeding2GiltIn } from '../../config';
import { BehaviorSubject } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Breeding2GiltInService extends CURDService<Breeding2GiltIn> {
  private recordSource = new BehaviorSubject([] );
  currentbreeding2GiltIn = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject([] );
  currentbreeding2GiltIn2 = this.recordSource2.asObservable();

  private realTotalWeightSource = new BehaviorSubject([] );
  realTotalWeightCurrent = this.realTotalWeightSource.asObservable();

  private realQtySource = new BehaviorSubject([] );
  realQtyCurrent = this.realQtySource.asObservable();

  private endEditSource = new BehaviorSubject(false);
  endEditCurrent = this.endEditSource.asObservable();

  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"breeding2GiltIn", utilitiesService);
  }
  changeBreeding2GiltIn(value) {
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
