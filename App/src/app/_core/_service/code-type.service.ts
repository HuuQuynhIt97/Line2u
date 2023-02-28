import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CodeType } from '../_model/code-type';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CodeTypeService extends CURDService<CodeType> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"CodeType", utilitiesService);
  }

  getCodeTypesDropdownlist(): Observable<any> {
    return this.http.get<any>(`${this.base}CodeType/GetCodeTypesDropdownlist`, {});
  }
}
