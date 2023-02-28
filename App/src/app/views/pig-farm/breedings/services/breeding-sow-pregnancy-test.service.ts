import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { BreedingSowPregnancyTest } from '../config';

@Injectable({
  providedIn: 'root'
})
export class BreedingSowPregnancyTestService extends CURDService<BreedingSowPregnancyTest> {

  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BreedingSowPregnancyTest", utilitiesService);
  }
}
