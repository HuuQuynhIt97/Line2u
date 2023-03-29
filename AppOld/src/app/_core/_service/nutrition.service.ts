import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

import { Nutrition } from '../_model/nutrition';
@Injectable({
  providedIn: 'root'
})
export class NutritionService extends CURDService<Nutrition> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Nutrition", utilitiesService);
  }

}
