
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../../_model/operation.result';
import { MakeOrder } from '../../_model/records';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MakeOrderService extends CURDService<MakeOrder> {
  private recordSource = new BehaviorSubject({} );
  currentMakeOrder = this.recordSource.asObservable();

  private recordSource2 = new BehaviorSubject({} );
  currentMakeOrder2 = this.recordSource2.asObservable();

  private recordSource3= new BehaviorSubject(0);
  currentMakeOrder3 = this.recordSource3.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"MakeOrder", utilitiesService);
  }
  changeMakeOrder(farm) {
    this.recordSource.next(farm)
  }
  changeMakeOrder2(farm) {
    this.recordSource2.next(farm)
  }
  changeMakeOrder3(farm) {
    this.recordSource3.next(farm)
  }
  getByGuid(guid) {
    return this.http.get<any>(`${this.base}MakeOrder/getByGuid?guid=${guid}`, {});
  }
  getPensByRoom(roomGuid) {
    return this.http.get<any>(`${this.base}MakeOrder/GetPensByRoom?roomGuid=${roomGuid}`, {});
  }
  getMakeOrderPenDropdown(makeOrderGuid) {
    return this.http.get<any>(`${this.base}MakeOrder/GetMakeOrderPenDropdown?makeOrderGuid=${makeOrderGuid}`, {});
  }
  getMakeOrderPen(makeOrderGuid, roomGuid) {
    return this.http.get<any>(`${this.base}MakeOrder/GetMakeOrderPen?makeOrderGuid=${makeOrderGuid}&roomGuid=${roomGuid}`, {});
  }
  storeMakeOrder2Pen(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}MakeOrder/StoreMakeOrder2Pen`, model)
      .pipe(catchError(this.handleError));
  }
  storeRoomGuid(model): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}MakeOrder/StoreRoomGuid`, model)
      .pipe(catchError(this.handleError));
  }

  addMakeOrder2Pen(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}MakeOrder/AddMakeOrder2Pen`, model)
      .pipe(catchError(this.handleError));
  }

  removeMakeOrder2Pen(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}MakeOrder/RemoveMakeOrder2Pen`, model)
      .pipe(catchError(this.handleError));
  }
}
