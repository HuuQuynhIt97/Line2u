import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { BreedingSowHeating } from '../config/model';

@Injectable({
  providedIn: 'root'
})
export class BreedingSowHeatingService extends CURDService<BreedingSowHeating> {

  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BreedingSowHeating", utilitiesService);
  }
}
