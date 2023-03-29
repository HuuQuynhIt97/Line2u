import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { FeedMaterial } from '../_model/feed-material';
@Injectable({
  providedIn: 'root'
})
export class FeedMaterialService extends CURDService<FeedMaterial> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"FeedMaterial", utilitiesService);
  }

}
