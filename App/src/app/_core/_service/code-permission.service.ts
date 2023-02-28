import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { CodePermission } from '../_model/code-permission';
@Injectable({
  providedIn: 'root'
})
export class CodePermissionService extends CURDService<CodePermission> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"CodePermission", utilitiesService);
  }
}
