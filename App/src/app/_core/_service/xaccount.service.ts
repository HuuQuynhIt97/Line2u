import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OperationResult } from '../_model/operation.result';
import { CURDService, UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Profile, XAccount } from '../_model/xaccount';
@Injectable({
  providedIn: 'root'
})
export class XAccountService extends CURDService<XAccount> {

  constructor(http: HttpClient,utilitiesService: UtilitiesService)
  {
    super(environment.apiUrl,http,"XAccount", utilitiesService);
  }
  showPassword(key): Observable<any> {
    const params = new FormData();
    params.append("key", key);
    return this.http.post<any>(`${this.base}XAccount/ShowPassword`, params).pipe(catchError(this.handleError));
  }
  getXAccountsToSendMessage(uid) {
    return this.http.get<any>(`${this.base}XAccount/GetXAccountsToSendMessage?uid=${uid}`, {});
  }
  getXAccountsToSendMessageWithKeyWord(key,uid) {
    return this.http.get<any>(`${this.base}XAccount/GetXAccountsToSendMessageWithKey?keywork=${key}&uid=${uid}`, {});
  }
  GetWithGuid(key) {
    return this.http.get<any>(`${this.base}XAccount/GetWithGuid?guid=${key}`, {});
  }
  changePassword(model): Observable<OperationResult> {
    return this.http.put<OperationResult>(`${this.base}XAccount/changePassword`, model).pipe(catchError(this.handleError));
  }
  insertForm(model: XAccount): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
    const file = model.file;
    delete model.file;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    return this.http.post<OperationResult>(`${this.base}XAccount/AddForm`, params).pipe(catchError(this.handleError));
  }
  updateForm(model: XAccount): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const file = model.file;
    delete model.file;
    const fileQR = model.fileQR;
    delete model.fileQR;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    params.append("fileQR", fileQR);

    return this.http.put<OperationResult>(`${this.base}XAccount/updateForm`, params).pipe(catchError(this.handleError));
  }
  updateFormMobile(model: XAccount): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }

    const file = model.file;
    delete model.file;
    const fileQR = model.fileQR;
    delete model.fileQR;
    const params = this.utilitiesService.ToFormData(model);
    params.append("file", file);
    params.append("fileQR", fileQR);

    return this.http.put<OperationResult>(`${this.base}XAccount/updateFormMobile`, params).pipe(catchError(this.handleError));
  }
  getPermissionsDropdown(accountGuid, lang) {
    return this.http.get<any>(`${this.base}XAccount/getPermissionsDropdown?lang=${lang}&accountGuid=${accountGuid}`, {});
  }
  getPermissions(accountGuid, lang) {
    return this.http.get<any>(`${this.base}XAccount/getPermissions?lang=${lang}&accountGuid=${accountGuid}`, {});
  }
  storePermission(model): Observable<OperationResult> {
    return this.http
      .post<OperationResult>(`${this.base}XAccount/StorePermission`, model)
      .pipe(catchError(this.handleError));
  }
  getProfile(key) {
    return this.http.get<any>(`${this.base}XAccount/GetProfile?key=${key}`, {});
  }
  storeProfile(model: Profile): Observable<OperationResult> {
    return this.http
      .put<OperationResult>(`${this.base}XAccount/StoreProfile`, model)
      .pipe(catchError(this.handleError));
  }

  getRejectsByAcceptance(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/getRejectsByAcceptance?farmGuid=${farmGuid}`, {});
  }
  getRejectsByRequisition(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetRejectsByRequisition?farmGuid=${farmGuid}`, {});
  }
  getRejectsByRepair(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetRejectsByRepair?farmGuid=${farmGuid}`, {});
  }
  getRejectsBySalesOrder(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetRejectsBySalesOrder?farmGuid=${farmGuid}`, {});
  }
  getRejectsByPigDisease(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetRejectsByPigDisease?farmGuid=${farmGuid}`, {});
  }
  getApproveByPigDisease(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetApproveByPigDisease?farmGuid=${farmGuid}`, {});
  }
  getRecordByPigDisease(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetRecordByPigDisease?farmGuid=${farmGuid}`, {});
  }
  getXAccountsForDropdown(farmGuid) {
    return this.http.get<any>(`${this.base}XAccount/GetXAccountsForDropdown?farmGuid=${farmGuid}`, {});
  }

  removeTokenLine(id) {
    return this.http.delete(`${this.base}XAccount/RemoveTokenLine?id=${id}`);
  }
  updateTokenLine(id, token) {
    return this.http.get(`${this.base}XAccount/UpdateTokenLine?id=${id}&token=${token}`);
  }
  SP_Record_AccountCheck_NeedCheck(accountGuid) {
    return this.http.get<any>(`${this.base}XAccount/SP_Record_AccountCheck_NeedCheck?accountGuid=${accountGuid}`, {});
  }
  SP_Record_AccountCheck_Confirm(accountGuid) {
    return this.http.get<any>(`${this.base}XAccount/SP_Record_AccountCheck_Confirm?accountGuid=${accountGuid}`, {});
  }
  SP_Record_AccountCheck_Born(recordGuid) {
    return this.http.get<any>(`${this.base}XAccount/SP_Record_AccountCheck_Born?recordGuid=${recordGuid}`, {});
  }
  SP_Record_AccountCheck_Remove(recordGuid) {
    return this.http.get<any>(`${this.base}XAccount/SP_Record_AccountCheck_Remove?recordGuid=${recordGuid}`, {});
  }

}
