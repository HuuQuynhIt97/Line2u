import { Injectable } from '@angular/core';

import { Bom } from '../_model/bom';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BOMShareService  {
  private bomSource = new BehaviorSubject({} as Bom);
  currentBOM = this.bomSource.asObservable();

  changeBOM(bom: Bom) {
    this.bomSource.next(bom)
  }

}
