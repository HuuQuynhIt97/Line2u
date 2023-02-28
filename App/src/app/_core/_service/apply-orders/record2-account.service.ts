
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationResult } from '../../_model/operation.result';
import { Record2Account } from '../../_model/apply-orders';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class Record2AccountService extends CURDService<Record2Account> {
  private recordSource = new BehaviorSubject({} );
  currentRecord2Account = this.recordSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Record2Account", utilitiesService);
  }
  changeRecord2Account(farm) {
    this.recordSource.next(farm)
  }
 
  
}
