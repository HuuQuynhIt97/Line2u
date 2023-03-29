
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room, RoomScreen } from '../../_model/farms';
import { OperationResult } from '../../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoomService extends CURDService<Room> {
  private bomSource = new BehaviorSubject({} as RoomScreen);
  currentRoom = this.bomSource.asObservable();
  constructor( http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"Room", utilitiesService);
  }
  changeRoom(farm: RoomScreen) {
    this.bomSource.next(farm)
  }
  getRoomByRecord(recordGuid, type): Observable<any> {
    return this.http.get<any>(`${this.base}Room/GetRoomByRecord?recordGuid=${recordGuid}&type=${type}`, {});
  }
  getRoomsByFarmGuid(farmGuid, barnGuid,makeOrderGuid): Observable<any> {
    return this.http.get<any>(`${this.base}Room/GetRoomsByFarmGuid?farmGuid=${farmGuid}&barnGuid=${barnGuid}&makeOrderGuid=${makeOrderGuid}`, {});
  }
  addRecord2Room(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}Room/AddRecord2Room`, model)
      .pipe(catchError(this.handleError));
  }

  removeRecord2Room(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}Room/RemoveRecord2Room`, model)
      .pipe(catchError(this.handleError));
  }
  

}
