import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Feed } from '../_model/feed';
@Injectable({
  providedIn: 'root'
})
export class FeedService extends CURDService<Feed> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Feed", utilitiesService);
  }

}
