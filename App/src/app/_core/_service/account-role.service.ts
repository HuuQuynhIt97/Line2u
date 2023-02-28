import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AccountRole } from '../_model/account-role';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountRoleService extends CURDService<AccountRole> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"AccountRole", utilitiesService);
  }
  // toggleIsDefault(id): Observable<OperationResult> {
  //   return this.http.put<OperationResult>(`${this.base}AccountRole/ToggleIsDefault?id=${id}`, {}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}
