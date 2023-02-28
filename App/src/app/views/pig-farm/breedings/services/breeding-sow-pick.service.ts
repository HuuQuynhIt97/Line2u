import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BreedingSowPick, Environment } from '../config';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BreedingSowPickService extends CURDService<BreedingSowPick> {

  constructor(http: HttpClient, utilitiesService: UtilitiesService) {
    super(environment.apiUrl,http,"BreedingSowPick", utilitiesService);
  }
}
