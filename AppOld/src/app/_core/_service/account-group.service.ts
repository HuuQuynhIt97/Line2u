import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AccountGroup } from '../_model/account-group';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountGroupService extends CURDService<AccountGroup> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"AccountGroup", utilitiesService);
  }

}
