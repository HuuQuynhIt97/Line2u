import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { BreedingSowMating } from '../config';

@Injectable({
  providedIn: 'root'
})
export class BreedingSowMatingService extends CURDService<BreedingSowMating> {

  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BreedingSowMating", utilitiesService);
  }
}
